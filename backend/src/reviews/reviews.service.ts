import { Injectable } from "@nestjs/common";
import { ApiError } from "../common/api-error";
import { camelizeRow, camelizeRows } from "../common/sql";
import { DatabaseService } from "../database/database.service";
import { BookingStatus } from "../bookings/booking-status.enum";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly db: DatabaseService) {}

  async listForBusiness(businessId: string) {
    const { rows } = await this.db.query(
      `select r.id,
              r.business_id,
              r.rating,
              r.comment,
              r.created_at,
              coalesce(p.full_name, 'Hermes customer') as customer_name,
              s.name as service_used
       from reviews r
       left join profiles p on p.id = r.user_id
       left join bookings bk on bk.id = r.booking_id
       left join services s on s.id = bk.service_id
       where r.business_id = $1
       order by r.created_at desc
       limit 24`,
      [businessId]
    );
    return camelizeRows(rows);
  }

  async create(userId: string, bookingId: string, dto: CreateReviewDto) {
    return this.db.transaction(async (client) => {
      const booking = await client.query(
        "select id, user_id, business_id, status from bookings where id = $1 and user_id = $2 for update",
        [bookingId, userId]
      );
      if (!booking.rows[0]) throw new ApiError("NOT_FOUND", "Booking not found.", 404);
      if (booking.rows[0].status !== BookingStatus.Completed) {
        throw new ApiError("BOOKING_NOT_COMPLETED", "You can review a business after the booking is completed.", 400);
      }
      const existing = await client.query("select id from reviews where booking_id = $1", [bookingId]);
      if (existing.rows[0]) {
        throw new ApiError("BOOKING_ALREADY_REVIEWED", "You have already reviewed this booking.", 409);
      }

      const { rows } = await client.query(
        `insert into reviews (booking_id, business_id, user_id, rating, comment)
         values ($1,$2,$3,$4,$5)
         returning id, booking_id, business_id, user_id, rating, comment, created_at, updated_at`,
        [bookingId, booking.rows[0].business_id, userId, dto.rating, dto.comment ?? null]
      );
      await client.query(
        `update businesses
         set average_rating = sub.average_rating,
             review_count = sub.review_count,
             updated_at = now()
         from (
           select business_id, round(avg(rating)::numeric, 2) as average_rating, count(*)::int as review_count
           from reviews
           where business_id = $1
           group by business_id
         ) sub
         where businesses.id = sub.business_id`,
        [booking.rows[0].business_id]
      );
      return camelizeRow(rows[0]);
    });
  }
}
