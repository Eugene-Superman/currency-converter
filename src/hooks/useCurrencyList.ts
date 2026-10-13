import { useQuery } from "@tanstack/react-query";
import { currencyApi } from "../api/currencyApi/currencyApi";

export default function useCurrencyList() {
  return useQuery({
    queryKey: ["currency-list"],
    queryFn: ({ signal }) => currencyApi.getCurrencies(signal),
    staleTime: Infinity,
  });
}
