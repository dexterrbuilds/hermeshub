import { Injectable } from "@nestjs/common";
import { PoolClient } from "pg";
import { ApiError } from "../common/api-error";
import { bookingReference, camelizeRow, camelizeRows } from "../common/sql";
import { DatabaseService } from "../database/database.service";
import { BookingStatus, canTransitionBooking } from "./booking-status.enum";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
  constructor(private readonly db: DatabaseService) {}

  async create(userId: string, dto: CreateBookingDto) {
    return this.db.transaction(async (client) => {
      const service = await this.getBookableService(client, dto.businessId, dto.serviceId);
      if (!service) throw new ApiError("SERVICE_INACTIVE", "This service is not available for booking.", 400);

      if (dto.addressId) {
        const address = await client.query("select id from addresses where id = $1 and user_id = $2", [dto.addressId, userId]);
        if (!address.rows[0]) throw new ApiError("FORBIDDEN", "That address is not available on your account.", 403);
      }

      const subtotal = Number(service.price ?? service.min_price ?? 0);
      const serviceFee = Math.round(Math.max(500, subtotal * 0.04));
      const total = subtotal + serviceFee;
      const ref = bookingReference();
      const { rows } = await client.query(
        `insert into bookings (
          booking_reference, user_id, business_id, service_id, address_id,
          requested_date, requested_time, notes, subtotal, service_fee, total, currency, status
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'NGN',$12)
        returning *`,
        [
          ref,
          userId,
          dto.businessId,
          dto.serviceId,
          dto.addressId ?? null,
          dto.requestedDate,
          dto.requestedTime,
          dto.notes ?? null,
          subtotal,
          serviceFee,
          total,
          BookingStatus.Requested
        ]
      );
      await client.query(
        `insert into booking_status_history (booking_id, old_status, new_status, changed_by)
         values ($1, null, $2, $3)`,
        [rows[0].id, BookingStatus.Requested, userId]
      );
      return this.detail(userId, rows[0].id);
    });
  }

  async list(userId: string, status?: "active" | "completed" | "cancelled") {
    const statuses =
      status === "completed"
        ? [BookingStatus.Completed]
        : status === "cancelled"
          ? [BookingStatus.Cancelled, BookingStatus.Rejected]
          : [BookingStatus.Requested, BookingStatus.Accepted, BookingStatus.OnTheWay, BookingStatus.InProgress];
    const { rows } = await this.db.query(
      `select ${this.bookingSelectSql()}
       from bookings bk
       join businesses b on b.id = bk.business_id
       join services s on s.id = bk.service_id
       left join business_images bi on bi.business_id = b.id and bi.is_cover = true
       where bk.user_id = $1 and bk.status = any($2)
       order by bk.created_at desc`,
      [userId, statuses]
    );
    return camelizeRows(rows);
  }

  async detail(userId: string, id: string) {
    const { rows } = await this.db.query(
      `select ${this.bookingSelectSql()},
              coalesce(hist.timeline, '[]'::jsonb) as timeline
       from bookings bk
       join businesses b on b.id = bk.business_id
       join services s on s.id = bk.service_id
       left join business_images bi on bi.business_id = b.id and bi.is_cover = true
       left join lateral (
         select jsonb_agg(jsonb_build_object('oldStatus', old_status, 'newStatus', new_status, 'changedBy', changed_by, 'createdAt', created_at) order by created_at) as timeline
         from booking_status_history bsh where bsh.booking_id = bk.id
       ) hist on true
       where bk.id = $1 and bk.user_id = $2`,
      [id, userId]
    );
    if (!rows[0]) throw new ApiError("NOT_FOUND", "Booking not found.", 404);
    return camelizeRow(rows[0]);
  }

  async updateStatus(userId: string, id: string, newStatus: BookingStatus) {
    return this.db.transaction(async (client) => {
      const { rows } = await client.query("select id, status from bookings where id = $1 for update", [id]);
      if (!rows[0]) throw new ApiError("NOT_FOUND", "Booking not found.", 404);
      const oldStatus = rows[0].status as BookingStatus;
      if (!canTransitionBooking(oldStatus, newStatus)) {
        throw new ApiError("BOOKING_INVALID_STATUS_TRANSITION", "That booking status change is not allowed.", 400);
      }
      await client.query("update bookings set status = $1, updated_at = now() where id = $2", [newStatus, id]);
      await client.query(
        "insert into booking_status_history (booking_id, old_status, new_status, changed_by) values ($1,$2,$3,$4)",
        [id, oldStatus, newStatus, userId]
      );
      return this.detailById(id);
    });
  }

  private async getBookableService(client: PoolClient, businessId: string, serviceId: string) {
    const { rows } = await client.query(
      `select s.*
       from services s
       join businesses b on b.id = s.business_id
       where s.id = $1 and s.business_id = $2 and s.is_active = true and b.is_active = true and b.accepts_bookings = true`,
      [serviceId, businessId]
    );
    return rows[0];
  }

  private bookingSelectSql() {
    return `
      bk.id,
      bk.booking_reference,
      bk.status,
      bk.requested_date,
      bk.requested_time,
      bk.notes,
      bk.subtotal,
      bk.service_fee,
      bk.total,
      bk.currency,
      bk.created_at,
      bk.updated_at,
      jsonb_build_object('id', b.id, 'name', b.name, 'coverImageUrl', coalesce(bi.public_url, ''), 'phone', b.phone) as business,
      jsonb_build_object('id', s.id, 'name', s.name, 'bookingType', s.booking_type, 'durationMinutes', s.duration_minutes) as service
    `;
  }

  private async detailById(id: string) {
    const { rows } = await this.db.query(
      `select ${this.bookingSelectSql()},
              coalesce(hist.timeline, '[]'::jsonb) as timeline
       from bookings bk
       join businesses b on b.id = bk.business_id
       join services s on s.id = bk.service_id
       left join business_images bi on bi.business_id = b.id and bi.is_cover = true
       left join lateral (
         select jsonb_agg(jsonb_build_object('oldStatus', old_status, 'newStatus', new_status, 'changedBy', changed_by, 'createdAt', created_at) order by created_at) as timeline
         from booking_status_history bsh where bsh.booking_id = bk.id
       ) hist on true
       where bk.id = $1`,
      [id]
    );
    if (!rows[0]) throw new ApiError("NOT_FOUND", "Booking not found.", 404);
    return camelizeRow(rows[0]);
  }
}
