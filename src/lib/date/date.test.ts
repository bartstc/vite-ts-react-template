import { describe, expect, it } from "vitest";

import { DateVO } from "@/lib/date/date";
import { generateDate } from "@/test-lib/date/generate-date";

describe("DateVO", () => {
  describe("isValidDateFormat", () => {
    it("should return true for a valid ISO date string", () => {
      expect(DateVO.isValidDateFormat("2023-10-17T12:00:00Z")).toBe(true);
    });

    it("should return true for a valid date object", () => {
      expect(DateVO.isValidDateFormat(new Date())).toBe(true);
    });

    it("should return true for a valid date string", () => {
      expect(DateVO.isValidDateFormat("October 17, 2023")).toBe(true);
    });

    it("should return false for an empty string input", () => {
      expect(DateVO.isValidDateFormat("")).toBe(false);
    });

    it("should return false for null input", () => {
      expect(DateVO.isValidDateFormat(null)).toBe(false);
    });

    it("should return false for undefined input", () => {
      expect(DateVO.isValidDateFormat(undefined)).toBe(false);
    });

    it("should return false for an empty object input", () => {
      expect(DateVO.isValidDateFormat({})).toBe(false);
    });

    it("should return false for an invalid date string", () => {
      expect(DateVO.isValidDateFormat("invalid-date-string")).toBe(false);
    });

    it("should return false for an invalid date object", () => {
      expect(DateVO.isValidDateFormat(new Date("invalid-date"))).toBe(false);
    });
  });

  describe("isDateBefore", () => {
    it("returns true if dateToCheck is before referenceDate", () => {
      expect(
        DateVO.isDateBefore(generateDate.now(), generateDate.future())
      ).toBe(true);
      expect(
        DateVO.isDateBefore(new Date("2023-01-01"), new Date("2023-01-02"))
      ).toBe(true);
    });

    it("returns false if dateToCheck is equal to or after referenceDate", () => {
      expect(DateVO.isDateBefore(generateDate.now(), generateDate.past())).toBe(
        false
      );
      expect(
        DateVO.isDateBefore(new Date("2022-01-02"), new Date("2022-01-01"))
      ).toBe(false);
    });
  });

  describe("isDateAfter", () => {
    it("returns true if dateToCheck is after referenceDate", () => {
      expect(DateVO.isDateAfter(generateDate.now(), generateDate.past())).toBe(
        true
      );
      expect(
        DateVO.isDateAfter(new Date("2022-01-02"), new Date("2022-01-01"))
      ).toBe(true);
    });

    it("returns false if dateToCheck is equal to or before referenceDate", () => {
      expect(
        DateVO.isDateAfter(generateDate.now(), generateDate.future())
      ).toBe(false);
      expect(
        DateVO.isDateAfter(new Date("2023-01-01"), new Date("2023-01-02"))
      ).toBe(false);
    });
  });
});
