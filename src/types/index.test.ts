import { isParsedSeat, isLayoutCell, type ParsedCell } from "./index";

describe("Type Guards", () => {
  describe("isParsedSeat", () => {
    it("should return true for seat type", () => {
      const seat: ParsedCell = {
        type: "seat",
        label: "A1",
        price: 100,
        status: "available",
      };
      expect(isParsedSeat(seat)).toBe(true);
    });

    it("should return true for berth type", () => {
      const berth: ParsedCell = {
        type: "berth",
        label: "B1",
        price: 200,
        status: "booked",
      };
      expect(isParsedSeat(berth)).toBe(true);
    });

    it("should return false for driver layout type", () => {
      const driver: ParsedCell = { type: "driver" };
      expect(isParsedSeat(driver)).toBe(false);
    });

    it("should return false for door layout type", () => {
      const door: ParsedCell = { type: "door" };
      expect(isParsedSeat(door)).toBe(false);
    });

    it("should return false for space layout type", () => {
      const space: ParsedCell = { type: "space" };
      expect(isParsedSeat(space)).toBe(false);
    });
  });

  describe("isLayoutCell", () => {
    it("should return true for driver type", () => {
      const driver: ParsedCell = { type: "driver" };
      expect(isLayoutCell(driver)).toBe(true);
    });

    it("should return true for door type", () => {
      const door: ParsedCell = { type: "door" };
      expect(isLayoutCell(door)).toBe(true);
    });

    it("should return true for space type", () => {
      const space: ParsedCell = { type: "space" };
      expect(isLayoutCell(space)).toBe(true);
    });

    it("should return false for seat type", () => {
      const seat: ParsedCell = {
        type: "seat",
        label: "A1",
        price: 100,
        status: "available",
      };
      expect(isLayoutCell(seat)).toBe(false);
    });

    it("should return false for berth type", () => {
      const berth: ParsedCell = {
        type: "berth",
        label: "B1",
        price: 200,
        status: "booked",
      };
      expect(isLayoutCell(berth)).toBe(false);
    });
  });

  describe("Type narrowing", () => {
    it("should properly narrow ParsedSeat type", () => {
      const seat: ParsedCell = {
        type: "seat",
        label: "A1",
        price: 100,
        status: "available",
      };

      if (isParsedSeat(seat)) {
        // TypeScript should allow access to seat-specific properties
        expect(seat.label).toBe("A1");
        expect(seat.price).toBe(100);
        expect(seat.status).toBe("available");
      }
    });

    it("should properly narrow ParsedLayoutCell type", () => {
      const layout: ParsedCell = { type: "driver" };

      if (isLayoutCell(layout)) {
        // TypeScript should narrow to ParsedLayoutCell
        expect(layout.type).toBe("driver");
      }
    });
  });
});
