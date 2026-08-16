import { bookingReference, camelizeRow } from "../src/common/sql";

describe("sql helpers", () => {
  it("camelizes snake_case rows", () => {
    expect(camelizeRow<{ bookingReference: string; createdAt: string }>({ booking_reference: "HMS-123ABC", created_at: "now" })).toEqual({
      bookingReference: "HMS-123ABC",
      createdAt: "now"
    });
  });

  it("generates human readable Hermes booking references", () => {
    expect(bookingReference()).toMatch(/^HMS-[A-Z0-9]{6}$/);
  });
});
