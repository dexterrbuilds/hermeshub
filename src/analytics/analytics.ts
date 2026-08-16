type AnalyticsEvent =
  | "search_performed"
  | "business_viewed"
  | "service_selected"
  | "booking_started"
  | "booking_created"
  | "booking_cancelled"
  | "booking_completed"
  | "review_submitted"
  | "favorite_added"
  | "favorite_removed";

export const analytics = {
  track(_event: AnalyticsEvent, _properties: Record<string, unknown> = {}) {
    // Provider intentionally omitted for beta foundation. Connect PostHog/Sentry later.
  }
};
