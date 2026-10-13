import { skipToken, useQuery } from "@tanstack/react-query";
import { currencyApi } from "../api/currencyApi/currencyApi";
import type { DataToConvert } from "../types/converting.types";

const CONVERSION_STALE_TIME = 5 * 60_000; // 5 minutes

export default function useCurrencyConvert({
  from,
  to,
  amount,
}: DataToConvert) {
  return useQuery({
    queryKey: ["convert", from, to, amount],
    queryFn:
      amount === null || amount === 0 || from === to
        ? skipToken
        : ({ signal }) =>
            currencyApi.getConversion({ from, to, amount }, signal),
    staleTime: CONVERSION_STALE_TIME,
  });
}
