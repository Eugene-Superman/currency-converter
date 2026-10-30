import { useEffect, useState } from "react";

const MAX_ITEMS = 5;

interface Props {
  convertResult?: string;
  isLoading: boolean;
}

export default function ResultList({ convertResult, isLoading }: Props) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (convertResult && !history.includes(convertResult)) {
      if (history.length >= MAX_ITEMS) {
        setHistory((prev) => [convertResult, ...prev.slice(0, -1)]);
        return;
      }

      setHistory((prev) => {
        return [convertResult, ...prev];
      });
    }
  }, [convertResult, isLoading]);

  return (
    <div>
      <ul>
        {history.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
