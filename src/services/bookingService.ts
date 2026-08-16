import { activeOrder, orders } from "@/data/mockMarketplace";
import { shouldUseMockApi } from "@/config/env";
import { apiClient } from "@/services/apiClient";
import { mapApiBooking } from "@/services/apiMappers";
import { mockDelay } from "@/services/mockTransport";

export const bookingService = {
  async getActiveOrder() {
    if (!shouldUseMockApi()) {
      const items = await apiClient.get<never[]>("/bookings?status=active");
      return items[0] ? mapApiBooking(items[0]) : undefined;
    }
    await mockDelay();
    return activeOrder;
  },

  async getOrders() {
    if (!shouldUseMockApi()) {
      const active = await apiClient.get<never[]>("/bookings?status=active");
      const completed = await apiClient.get<never[]>("/bookings?status=completed");
      return [...active, ...completed].map(mapApiBooking);
    }
    await mockDelay();
    return orders;
  },

  async confirmBooking(input?: { businessId: string; serviceId: string; requestedDate: string; requestedTime: string; addressId?: string; notes?: string }) {
    if (!shouldUseMockApi() && input) {
      return apiClient.post("/bookings", input);
    }
    await mockDelay(700, 950);
    return {
      ok: true,
      order: activeOrder
    };
  }
};
