import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { API_PREFIX } from "../apiConfig";
import type { CurrencyDto } from "../types/currency.types";

const rates: Record<string, number> = { USD: 1, EUR: 0.9, PLN: 4, JPY: 150 };

function currency(code: string, name: string, precision = 2): CurrencyDto {
  return {
    id: 1,
    name,
    short_code: code,
    code: "",
    precision,
    subunit: 10 ** precision,
    symbol: "",
    symbol_first: true,
    decimal_mark: ".",
    thousands_separator: ",",
  };
}

const meta = { code: 200, disclaimer: "" };

export const server = setupServer(
  http.get(`${API_PREFIX}/currencies`, () =>
    HttpResponse.json({
      meta,
      response: [
        currency("EUR", "Euro"),
        currency("JPY", "Japanese Yen", 0),
        currency("PLN", "Polish Zloty"),
        currency("USD", "US Dollar"),
      ],
    }),
  ),

  http.get(`${API_PREFIX}/convert`, ({ request }) => {
    const params = new URL(request.url).searchParams;
    const from = params.get("from") ?? "";
    const to = params.get("to") ?? "";
    const amount = Number(params.get("amount"));

    return HttpResponse.json({
      meta,
      response: {
        timestamp: 0,
        date: "2026-10-13",
        from,
        to,
        amount,
        value: (amount / rates[from]) * rates[to],
      },
    });
  }),
);
