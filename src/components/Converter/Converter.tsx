import { useMemo, useState } from "react";
import styles from "./Converter.module.css";
import useCurrencyList from "../../hooks/useCurrencyList";
import ConversionRow from "../ConversionRow/ConversionRow";
import Loader from "../Loader/Loader";
import type { SelectOption } from "../Select/Select";
import useCurrencyConvert from "../../hooks/useCurrencyConvert";
import {
  getInputValues,
  toConvertParams,
  type EditedAmount,
} from "./getInputValues";
import useDebounce from "../../hooks/useDebounce";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ConversionStatus from "../ConversionStatus/ConversionStatus";
import ResultList from "../ResultList/ResultList";

export default function Converter() {
  const [fromCode, setFromCode] = useState("PLN");
  const [toCode, setToCode] = useState("USD");
  const [edited, setEdited] = useState<EditedAmount>({
    side: "from",
    value: "1",
  });

  const debouncedEdited = useDebounce(edited);

  const {
    data: currencies,
    error: currenciesError,
    isPending: isCurrenciesPending,
    refetch: currenciesRefetch,
  } = useCurrencyList();

  const {
    data: convertResult,
    error: convertError,
    refetch: convertRefetch,
  } = useCurrencyConvert(toConvertParams(debouncedEdited, fromCode, toCode));

  const { currencyOptions, precisions } = useMemo(() => {
    const currencyOptions: SelectOption[] = [];
    const precisions = new Map<string, number>();

    for (const { code, precision, name } of currencies ?? []) {
      precisions.set(code, precision);
      currencyOptions.push({ text: `${code}. ${name}`, value: code });
    }

    return { currencyOptions, precisions };
  }, [currencies]);

  const handleFromAmountChange = (value: string) => {
    setEdited({ side: "from", value });
  };
  const handleToAmountChange = (value: string) => {
    setEdited({ side: "to", value });
  };

  if (isCurrenciesPending) {
    return <Loader />;
  }

  if (currenciesError) {
    return (
      <ErrorMessage
        error={currenciesError}
        onRetry={() => void currenciesRefetch()}
      />
    );
  }

  const { fromAmount, toAmount, isAwaitingResult } = getInputValues({
    edited,
    convertParams: toConvertParams(edited, fromCode, toCode),
    convertResult,
    precisions,
  });

  const convertingInProgress = isAwaitingResult && !convertError;

  return (
    <div className={styles.converter}>
      <ConversionRow
        title="From"
        currencyOptions={currencyOptions}
        selectedCurrencyCode={fromCode}
        onCurrencyChange={setFromCode}
        currencyAmount={fromAmount}
        onAmountChange={handleFromAmountChange}
        isConverting={convertingInProgress && edited.side === "to"}
      />
      <ConversionRow
        title="To"
        currencyOptions={currencyOptions}
        selectedCurrencyCode={toCode}
        onCurrencyChange={setToCode}
        currencyAmount={toAmount}
        onAmountChange={handleToAmountChange}
        isConverting={convertingInProgress && edited.side === "from"}
      />
      <ConversionStatus
        isConverting={convertingInProgress}
        fromAmount={fromAmount}
        toAmount={toAmount}
        fromCode={fromCode}
        toCode={toCode}
      />
      <ResultList
        convertResult={`${fromAmount} ${fromCode} = ${toAmount} ${toCode}`}
        isLoading={convertingInProgress}
      />
      {convertError && (
        <ErrorMessage
          error={convertError}
          onRetry={() => void convertRefetch()}
        />
      )}
    </div>
  );
}
