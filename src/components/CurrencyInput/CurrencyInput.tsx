import type { ChangeEvent } from "react";
import styles from "./CurrencyInput.module.css";
import { amountUtils } from "../../utils/amount.utils";

export type CurrencyInputHandler = (text: string) => void;

interface Props {
  label: string;
  value: string;
  onChange: CurrencyInputHandler;
  isLoading: boolean;
}

export default function CurrencyInput({
  label,
  value,
  isLoading,
  onChange,
}: Props) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (!amountUtils.isValidInput(value)) {
      return;
    }

    onChange(value);
  };

  return (
    <label>
      <span className="visually-hidden">{label}</span>
      <input
        className={styles.input}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={isLoading ? "Converting..." : "0"}
        aria-busy={isLoading}
        value={value}
        onChange={handleChange}
      />
    </label>
  );
}
