import { reviews } from "@/data/mockMarketplace";
import { shouldUseMockApi } from "@/config/env";
import { apiClient } from "@/services/apiClient";
import { mapApiReview } from "@/services/apiMappers";
import { mockDelay } from "@/services/mockTransport";

export const reviewService = {
  async getBusinessReviews(businessId: string) {
    if (!shouldUseMockApi()) {
      const items = await apiClient.get<unknown[]>(`/businesses/${businessId}/reviews`);
      return items.map((item) => mapApiReview(item as never));
    }
    await mockDelay();
    return reviews.filter((review) => review.vendorId === businessId);
  },

  async submitReview(input?: { bookingId?: string; rating?: number; comment?: string }) {
    if (!shouldUseMockApi() && input?.bookingId) {
      return apiClient.post(`/bookings/${input.bookingId}/review`, {
        rating: input.rating ?? 5,
        comment: input.comment ?? ""
      });
    }
    await mockDelay(520, 780);
    return { ok: true };
  }
};
