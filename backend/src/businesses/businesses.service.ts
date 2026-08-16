import { Injectable } from "@nestjs/common";
import { ApiError } from "../common/api-error";
import { camelizeRow, camelizeRows } from "../common/sql";
import { DatabaseService } from "../database/database.service";
import { NearbyBusinessesDto } from "./dto/nearby-businesses.dto";
import { SearchBusinessesDto } from "./dto/search-businesses.dto";

@Injectable()
export class BusinessesService {
  constructor(private readonly db: DatabaseService) {}

  async search(query: SearchBusinessesDto) {
    const q = query.q?.trim() || null;
    const verified = query.verified === "true";
    const available = query.available === "true";
    const params = [q, query.category ?? null, query.area ?? null, verified, available];
    const { rows } = await this.db.query(
      `with business_search as (
         select distinct b.id
         from businesses b
         join business_locations bl on bl.business_id = b.id
         left join business_categories bc on bc.business_id = b.id
         left join categories c on c.id = bc.category_id
         left join services s on s.business_id = b.id and s.is_active = true
         where b.is_active = true
           and ($1::text is null or (
             to_tsvector('simple', coalesce(b.name,'') || ' ' || coalesce(b.tagline,'') || ' ' || coalesce(b.description,'') || ' ' || coalesce(c.name,'') || ' ' || coalesce(s.name,'') || ' ' || coalesce(bl.area,'')) @@ plainto_tsquery('simple', $1)
             or b.name ilike '%' || $1 || '%'
             or s.name ilike '%' || $1 || '%'
             or bl.area ilike '%' || $1 || '%'
           ))
           and ($2::text is null or c.slug = $2 or c.id::text = $2)
           and ($3::text is null or lower(bl.area) = lower($3))
           and ($4::boolean = false or b.verification_status = 'verified')
           and ($5::boolean = false or b.accepts_bookings = true)
       )
       select ${this.businessSelectSql()}
       from businesses b
       join business_search bs on bs.id = b.id
       join business_locations bl on bl.business_id = b.id
       left join lateral (${this.servicePreviewSql()}) svc on true
       left join lateral (${this.categoryAggSql()}) cat on true
       order by
         case when $1::text is not null and b.name ilike $1 || '%' then 0 else 1 end,
         b.average_rating desc,
         b.completed_booking_count desc
       limit 50`,
      params
    );
    return camelizeRows(rows);
  }

  async nearby(query: NearbyBusinessesDto) {
    const lat = Number(query.latitude);
    const lng = Number(query.longitude);
    const radiusKm = Number(query.radius ?? 10);
    const { rows } = await this.db.query(
      `select ${this.businessSelectSql()},
              round((st_distance(bl.geo_point, st_setsrid(st_makepoint($2, $1), 4326)::geography) / 1000)::numeric, 2) as distance_km
       from businesses b
       join business_locations bl on bl.business_id = b.id
       left join business_categories bc on bc.business_id = b.id
       left join categories c on c.id = bc.category_id
       left join lateral (${this.servicePreviewSql()}) svc on true
       left join lateral (${this.categoryAggSql()}) cat on true
       where b.is_active = true
         and st_dwithin(bl.geo_point, st_setsrid(st_makepoint($2, $1), 4326)::geography, $3 * 1000)
         and ($4::text is null or c.slug = $4 or c.id::text = $4)
       group by b.id, bl.id, svc.services, cat.categories
       order by distance_km asc, b.average_rating desc
       limit 50`,
      [lat, lng, radiusKm, query.category ?? null]
    );
    return camelizeRows(rows);
  }

  async detail(id: string) {
    const { rows } = await this.db.query(
      `select ${this.businessSelectSql()},
              jsonb_build_object(
                'address', bl.address,
                'area', bl.area,
                'city', bl.city,
                'state', bl.state,
                'latitude', bl.latitude,
                'longitude', bl.longitude,
                'serviceRadiusKm', bl.service_radius_km
              ) as location,
              coalesce(img.images, '[]'::jsonb) as images,
              coalesce(hours.hours, '[]'::jsonb) as hours,
              coalesce(svc_full.services, '[]'::jsonb) as services,
              coalesce(rev.reviews, '[]'::jsonb) as recent_reviews
       from businesses b
       join business_locations bl on bl.business_id = b.id
       left join lateral (${this.servicePreviewSql()}) svc on true
       left join lateral (${this.categoryAggSql()}) cat on true
       left join lateral (
         select jsonb_agg(jsonb_build_object('id', bi.id, 'url', bi.public_url, 'isCover', bi.is_cover, 'sortOrder', bi.sort_order) order by bi.sort_order) as images
         from business_images bi where bi.business_id = b.id
       ) img on true
       left join lateral (
         select jsonb_agg(jsonb_build_object('weekday', weekday, 'opensAt', opens_at, 'closesAt', closes_at, 'isClosed', is_closed) order by weekday) as hours
         from business_hours bh where bh.business_id = b.id
       ) hours on true
       left join lateral (
         select jsonb_agg(jsonb_build_object(
           'id', s.id,
           'businessId', s.business_id,
           'name', s.name,
           'description', s.description,
           'priceType', s.price_type,
           'price', s.price,
           'minPrice', s.min_price,
           'maxPrice', s.max_price,
           'durationMinutes', s.duration_minutes,
           'bookingType', s.booking_type,
           'leadTimeHours', s.lead_time_hours,
           'isActive', s.is_active
         ) order by s.sort_order, s.name) as services
         from services s where s.business_id = b.id and s.is_active = true
       ) svc_full on true
       left join lateral (
         select jsonb_agg(jsonb_build_object('id', r.id, 'rating', r.rating, 'comment', r.comment, 'createdAt', r.created_at, 'userId', r.user_id) order by r.created_at desc) as reviews
         from reviews r where r.business_id = b.id limit 5
       ) rev on true
       where b.id = $1 and b.is_active = true`,
      [id]
    );
    if (!rows[0]) throw new ApiError("NOT_FOUND", "Business not found.", 404);
    return camelizeRow(rows[0]);
  }

  private businessSelectSql() {
    return `
      b.id,
      b.name,
      b.slug,
      b.tagline,
      b.description,
      b.verification_status,
      b.average_rating,
      b.review_count,
      b.completed_booking_count,
      b.phone,
      b.email,
      b.accepts_bookings,
      bl.area,
      bl.city,
      bl.state,
      bl.service_radius_km,
      coalesce((select public_url from business_images bi where bi.business_id = b.id and bi.is_cover = true order by sort_order limit 1), '') as cover_image_url,
      coalesce(svc.services, '[]'::jsonb) as service_preview,
      coalesce(cat.categories, '[]'::jsonb) as categories
    `;
  }

  private servicePreviewSql() {
    return `
      select jsonb_agg(jsonb_build_object('id', s.id, 'name', s.name, 'priceType', s.price_type, 'price', s.price, 'minPrice', s.min_price, 'bookingType', s.booking_type) order by s.sort_order, s.name) as services
      from services s
      where s.business_id = b.id and s.is_active = true
      limit 3
    `;
  }

  private categoryAggSql() {
    return `
      select jsonb_agg(distinct jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon)) as categories
      from business_categories bc
      join categories c on c.id = bc.category_id
      where bc.business_id = b.id and c.is_active = true
    `;
  }
}
