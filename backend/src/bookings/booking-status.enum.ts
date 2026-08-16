export enum BookingStatus {
  Requested = "requested",
  Accepted = "accepted",
  Rejected = "rejected",
  Cancelled = "cancelled",
  OnTheWay = "on_the_way",
  InProgress = "in_progress",
  Completed = "completed"
}

export const validBookingTransitions: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.Requested]: [BookingStatus.Accepted, BookingStatus.Rejected, BookingStatus.Cancelled],
  [BookingStatus.Accepted]: [BookingStatus.OnTheWay, BookingStatus.InProgress, BookingStatus.Cancelled],
  [BookingStatus.Rejected]: [],
  [BookingStatus.Cancelled]: [],
  [BookingStatus.OnTheWay]: [BookingStatus.InProgress, BookingStatus.Cancelled],
  [BookingStatus.InProgress]: [BookingStatus.Completed, BookingStatus.Cancelled],
  [BookingStatus.Completed]: []
};

export function canTransitionBooking(oldStatus: BookingStatus, newStatus: BookingStatus) {
  return validBookingTransitions[oldStatus]?.includes(newStatus) ?? false;
}
