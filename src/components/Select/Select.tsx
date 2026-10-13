import { memo } from "react";
import styles from "./Select.module.css";

export interface SelectOption {
  text: string;
  value: string;
}

export type SelectHandler = (value: SelectOption["value"]) => void;

interface Props {
  label: string;
  value: SelectOption["value"];
  options: SelectOption[];
  onSelect: SelectHandler;
}

function Select({ label, value, options, onSelect }: Props) {
  return (
    <label>
      <span className="visually-hidden">{label}</span>
      <select
        className={styles.select}
        value={value}
        onChange={(event) => onSelect(event.currentTarget.value)}
      >
        {options.map(({ value, text }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

export default memo(Select);
