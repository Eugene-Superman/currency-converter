import type { Meta } from "./currency.types";

export interface DataToConvert {
  from: string;
  to: string;
  amount: number | null;
}

export interface ConvertDto {
  timestamp: number;
  date: string;
  from: string;
  to: string;
  amount: number;
  value: number;
}

export interface ConvertResponse {
  meta: Meta;
  response: ConvertDto;
}

export type Converted = Pick<ConvertDto, "from" | "to" | "amount" | "value">;
