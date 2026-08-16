import { BookingStatus, canTransitionBooking } from "../src/bookings/booking-status.enum";

describe("booking status transitions", () => {
  it("allows expected forward transitions", () => {
    expect(canTransitionBooking(BookingStatus.Requested, BookingStatus.Accepted)).toBe(true);
    expect(canTransitionBooking(BookingStatus.Accepted, BookingStatus.OnTheWay)).toBe(true);
    expect(canTransitionBooking(BookingStatus.OnTheWay, BookingStatus.InProgress)).toBe(true);
    expect(canTransitionBooking(BookingStatus.InProgress, BookingStatus.Completed)).toBe(true);
  });

  it("rejects invalid backward transitions", () => {
    expect(canTransitionBooking(BookingStatus.Completed, BookingStatus.Requested)).toBe(false);
    expect(canTransitionBooking(BookingStatus.Cancelled, BookingStatus.Accepted)).toBe(false);
    expect(canTransitionBooking(BookingStatus.Rejected, BookingStatus.Accepted)).toBe(false);
  });
});
