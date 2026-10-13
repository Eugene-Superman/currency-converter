import { API_PREFIX } from "../../apiConfig";
import type { Converted, ConvertResponse } from "../../types/converting.types";
import type {
  CurrenciesResponse,
  Currency,
  CurrencyDto,
} from "../../types/currency.types";
import { amountUtils } from "../../utils/amount.utils";
import { fetchRequest } from "../fetchRequest/fetchRequest";

const adaptToCurrency = ({ name, short_code, precision }: CurrencyDto) => ({
  name,
  code: short_code,
  precision,
});

async function getCurrencies(signal: AbortSignal): Promise<Currency[]> {
  const result = await fetchRequest<CurrenciesResponse>(
    `${API_PREFIX}/currencies`,
    {
      signal,
    },
  );

  return result.response.map(adaptToCurrency);
}

async function getConversion(
  convertParams: { from: string; to: string; amount: number },
  signal: AbortSignal,
): Promise<Converted> {
  const query = new URLSearchParams({
    from: convertParams.from,
    to: convertParams.to,
    amount: amountUtils.formatToConvert(convertParams.amount),
  });

  const result = await fetchRequest<ConvertResponse>(
    `${API_PREFIX}/convert?${query.toString()}`,
    {
      signal,
    },
  );

  const { from, to, amount, value } = result.response;

  return {
    from,
    to,
    amount,
    value,
  };
}

export const currencyApi = { getCurrencies, getConversion };
