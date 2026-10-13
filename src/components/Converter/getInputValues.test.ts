import { describe, expect, it } from "vitest";
import type { Converted } from "../../types/converting.types";
import {
  getInputValues,
  toConvertParams,
  type EditedAmount,
} from "./getInputValues";

const precisions = new Map([
  ["PLN", 2],
  ["USD", 2],
]);

function valuesFor(
  edited: EditedAmount,
  convertResult?: Converted,
  [fromCode, toCode] = ["PLN", "USD"],
) {
  return getInputValues({
    edited,
    convertParams: toConvertParams(edited, fromCode, toCode),
    convertResult,
    precisions,
  });
}

describe("getInputValues", () => {
  it("waits until the result matches the amount and the currencies", () => {
    const forOtherAmount = { from: "PLN", to: "USD", amount: 10, value: 2.5 };
    const forOtherCurrency = { from: "PLN", to: "EUR", amount: 20, value: 4.5 };

    expect(valuesFor({ side: "from", value: "20" }, forOtherAmount)).toEqual({
      fromAmount: "20",
      toAmount: "",
      isAwaitingResult: true,
    });
    expect(
      valuesFor({ side: "from", value: "20" }, forOtherCurrency),
    ).toMatchObject({ toAmount: "", isAwaitingResult: true });
  });

  it("leaves the other field empty when there is no amount", () => {
    expect(valuesFor({ side: "from", value: "" })).toEqual({
      fromAmount: "",
      toAmount: "",
      isAwaitingResult: false,
    });
  });

  it("doesn't wait for the API for zero or the same currency", () => {
    expect(valuesFor({ side: "from", value: "0" })).toMatchObject({
      toAmount: "0.00",
      isAwaitingResult: false,
    });
    expect(
      valuesFor({ side: "from", value: "5" }, undefined, ["USD", "USD"]),
    ).toMatchObject({ toAmount: "5.00", isAwaitingResult: false });
  });
});
