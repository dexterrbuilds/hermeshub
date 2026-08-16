export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "BOOKING_TIME_UNAVAILABLE"
  | "BOOKING_INVALID_STATUS_TRANSITION"
  | "BOOKING_NOT_COMPLETED"
  | "BOOKING_ALREADY_REVIEWED"
  | "BETA_ADMIN_DISABLED"
  | "BETA_ADMIN_NOT_CONFIGURED"
  | "SERVICE_INACTIVE"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status = 400
  ) {
    super(message);
  }
}
