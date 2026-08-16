import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { BetaAdminGuard } from "../auth/beta-admin.guard";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";
import { BookingsService } from "./bookings.service";

@Controller("bookings")
@UseGuards(SupabaseAuthGuard)
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateBookingDto) {
    return this.bookings.create(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: { id: string }, @Query("status") status?: "active" | "completed" | "cancelled") {
    return this.bookings.list(user.id, status);
  }

  @Get(":id")
  detail(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.bookings.detail(user.id, id);
  }

  @Patch(":id/status")
  @UseGuards(BetaAdminGuard)
  updateStatus(@CurrentUser() user: { id: string }, @Param("id") id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookings.updateStatus(user.id, id, dto.status);
  }
}
