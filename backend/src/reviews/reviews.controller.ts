import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewsService } from "./reviews.service";

@Controller()
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get("businesses/:businessId/reviews")
  listForBusiness(@Param("businessId") businessId: string) {
    return this.reviews.listForBusiness(businessId);
  }

  @Post("bookings/:bookingId/review")
  @UseGuards(SupabaseAuthGuard)
  create(@CurrentUser() user: { id: string }, @Param("bookingId") bookingId: string, @Body() dto: CreateReviewDto) {
    return this.reviews.create(user.id, bookingId, dto);
  }
}
