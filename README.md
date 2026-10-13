# Currency Converter

A simple currency converter, similar to the one in Google. Built with React, TypeScript and TanStack Query, rates come from [CurrencyBeacon](https://currencybeacon.com).

## How to run

You'll need Node 22.13+ or 24 and a free CurrencyBeacon API key.

1. `npm ci`
2. `cp .env.example .env.local` and put your API key there
3. `npm run dev` and open http://localhost:5173

Tests: `npm test`

## Notes

- CurrencyBeacon doesn't support CORS, so the app calls `/currency-api` and the Vite proxy forwards it to the API with the key. This way the key isn't exposed in the browser, but the app only works with `npm run dev` or `npm run preview`.
- Both fields are editable. Typing is debounced (300 ms), changing a currency converts right away.
- I use `short_code` from the API as the currency code and `precision` to round the result, so JPY has no decimals, for example.
- Only fiat currencies are listed (API default).
- If something doesn't work, check the console: 401 means the API key is wrong, 429 means the request limit is reached.
