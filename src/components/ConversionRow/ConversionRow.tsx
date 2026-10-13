import styles from "./ConversionRow.module.css";
import CurrencyInput, {
  type CurrencyInputHandler,
} from "../CurrencyInput/CurrencyInput";
import Select, {
  type SelectHandler,
  type SelectOption,
} from "../Select/Select";

interface Props {
  title: string;
  isConverting: boolean;

  currencyOptions: SelectOption[];
  selectedCurrencyCode: string;
  onCurrencyChange: SelectHandler;

  currencyAmount: string;
  onAmountChange: CurrencyInputHandler;
}

export default function ConversionRow({
  title,
  isConverting,
  currencyOptions,
  selectedCurrencyCode,
  onCurrencyChange,
  currencyAmount,
  onAmountChange,
}: Props) {
  return (
    <div>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.fields}>
        <Select
          label={`${title} currency:`}
          options={currencyOptions}
          value={selectedCurrencyCode}
          onSelect={onCurrencyChange}
        />
        <CurrencyInput
          label={`${title} amount:`}
          value={currencyAmount}
          onChange={onAmountChange}
          isLoading={isConverting}
        />
      </div>
    </div>
  );
}
