export interface CurrencyDto {
  id: number;
  name: string;
  short_code: string;
  code: string;
  precision: number;
  subunit: number;
  symbol: string;
  symbol_first: boolean;
  decimal_mark: string;
  thousands_separator: string;
}

export interface Meta {
  code: number;
  disclaimer: string;
}

export interface CurrenciesResponse {
  meta: Meta;
  response: CurrencyDto[];
}

export interface Currency {
  code: string;
  name: string;
  precision: number;
}
