import { Injectable } from "@nestjs/common";
import { ApiError } from "../common/api-error";
import { camelizeRow } from "../common/sql";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class ServicesService {
  constructor(private readonly db: DatabaseService) {}

  async detail(id: string) {
    const { rows } = await this.db.query(
      `select s.id,
              s.business_id,
              s.name,
              s.description,
              s.price_type,
              s.price,
              s.min_price,
              s.max_price,
              s.duration_minutes,
              s.booking_type,
              s.lead_time_hours,
              s.is_active,
              coalesce((select public_url from business_images bi where bi.business_id = s.business_id and bi.is_cover = true order by sort_order limit 1), '') as image_url
       from services s
       join businesses b on b.id = s.business_id
       where s.id = $1 and s.is_active = true and b.is_active = true`,
      [id]
    );
    if (!rows[0]) throw new ApiError("NOT_FOUND", "Service not found.", 404);
    return camelizeRow(rows[0]);
  }
}
