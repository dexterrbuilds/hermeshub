import { businessApplicationService } from "@/services/businessApplicationService";
import { mockDelay } from "@/services/mockTransport";

export const businessVerificationService = {
  async getVerificationStatus() {
    await mockDelay(180, 320);
    const application = await businessApplicationService.getCurrentApplication();
    return {
      status: application.status,
      title: statusTitle(application.status),
      message: statusMessage(application.status)
    };
  }
};

function statusTitle(status: string) {
  if (status === "submitted" || status === "under_review") return "We're reviewing your business";
  if (status === "info_required") return "More information needed";
  if (status === "approved") return "Your business is verified";
  if (status === "rejected") return "Application not approved";
  return "Business setup in progress";
}

function statusMessage(status: string) {
  if (status === "submitted" || status === "under_review") return "Your submission has been received. We'll let you know when verification is complete.";
  if (status === "info_required") return "Hermes needs a few more details before review can continue.";
  if (status === "approved") return "You can now manage services, bookings, and business details.";
  if (status === "rejected") return "Review the feedback and submit a corrected application when ready.";
  return "Finish your setup to submit your business for Hermes review.";
}
