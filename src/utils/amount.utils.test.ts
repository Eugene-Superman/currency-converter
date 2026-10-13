import { describe, expect, it, vi } from "vitest";
import { amountUtils } from "./amount.utils";

describe("isValidInput", () => {
  it("accepts numbers with a dot or a comma", () => {
    expect(amountUtils.isValidInput("12")).toBe(true);
    expect(amountUtils.isValidInput("12.5")).toBe(true);
    expect(amountUtils.isValidInput("12,5")).toBe(true);
    expect(amountUtils.isValidInput("12.")).toBe(true);
    expect(amountUtils.isValidInput("")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(amountUtils.isValidInput("abc")).toBe(false);
    expect(amountUtils.isValidInput("-5")).toBe(false);
    expect(amountUtils.isValidInput("1.2.3")).toBe(false);
    expect(amountUtils.isValidInput("1 000")).toBe(false);
  });
});

describe("parseToNumber", () => {
  it("treats a comma as a decimal separator", () => {
    expect(amountUtils.parseToNumber("12.5")).toBe(12.5);
    expect(amountUtils.parseToNumber("12,5")).toBe(12.5);
    expect(amountUtils.parseToNumber(".5")).toBe(0.5);
  });

  it("returns null when there is no usable number", () => {
    expect(amountUtils.parseToNumber("")).toBeNull();
    expect(amountUtils.parseToNumber(".")).toBeNull();
    expect(amountUtils.parseToNumber("abc")).toBeNull();
    expect(amountUtils.parseToNumber("9".repeat(400))).toBeNull();
  });
});

describe("format", () => {
  it("rounds to the currency precision", () => {
    expect(amountUtils.format(1234.567, 2)).toBe("1234.57");
    expect(amountUtils.format(1234.567, 0)).toBe("1235");
    expect(amountUtils.format(0.5, 3)).toBe("0.500");
  });

  it("uses latin digits in any locale", () => {
    vi.spyOn(navigator, "language", "get").mockReturnValue("ar-EG");

    expect(amountUtils.format(1234.5, 2)).toBe("1234.50");
  });
});

describe("formatToConvert", () => {
  it("never uses the exponent notation", () => {
    expect(amountUtils.formatToConvert(0.0000001)).toBe("0.0000001");
    expect(amountUtils.formatToConvert(1e21)).toBe("1000000000000000000000");
  });
});
