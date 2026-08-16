import { mockDelay } from "@/services/mockTransport";

export const businessManagementService = {
  async getBusinessOverview() {
    await mockDelay(260, 480);
    return {
      businessName: "Your Hermes business",
      status: "draft",
      bookingsToday: 0,
      pendingBookings: 0,
      services: 0,
      rating: undefined,
      nextAction: "Finish business setup"
    };
  }
};
