import type { Converted, DataToConvert } from "../../types/converting.types";
import { amountUtils } from "../../utils/amount.utils";

interface InputValues {
  fromAmount: string;
  toAmount: string;
  isAwaitingResult: boolean;
}

export type Side = "from" | "to";

export interface EditedAmount {
  side: Side;
  value: string;
}

interface InputValuesParams {
  edited: EditedAmount;
  convertParams: DataToConvert;
  convertResult: Converted | undefined;
  precisions: Map<string, number>;
}

export function toConvertParams(
  edited: EditedAmount,
  fromCode: string,
  toCode: string,
): DataToConvert {
  const amount = amountUtils.parseToNumber(edited.value);

  return edited.side === "from"
    ? { from: fromCode, to: toCode, amount }
    : { from: toCode, to: fromCode, amount };
}

export function getInputValues({
  edited,
  convertParams,
  convertResult,
  precisions,
}: InputValuesParams): InputValues {
  const { from, to, amount } = convertParams;
  let convertedText = "";
  let isAwaitingResult = false;

  if (amount !== null) {
    if (from === to || amount === 0) {
      convertedText = amountUtils.format(amount, precisions.get(to));
    } else if (
      convertResult?.from === from &&
      convertResult.to === to &&
      convertResult.amount === amount
    ) {
      convertedText = amountUtils.format(
        convertResult.value,
        precisions.get(to),
      );
    } else {
      isAwaitingResult = true;
    }
  }

  return edited.side === "from"
    ? { fromAmount: edited.value, toAmount: convertedText, isAwaitingResult }
    : { fromAmount: convertedText, toAmount: edited.value, isAwaitingResult };
}
