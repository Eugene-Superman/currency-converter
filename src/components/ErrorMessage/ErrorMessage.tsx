import styles from "./ErrorMessage.module.css";
import { ApiError, isRetryableError } from "../../api/error/ApiError";

interface Props {
  error: Error;
  onRetry?: () => void;
}

function getMessage(error: Error): string {
  if (error instanceof ApiError) {
    return "Currency rates are unavailable right now. Please try again later.";
  }
  return "Couldn't reach the currency service. Check your connection and try again.";
}

export default function ErrorMessage({ error, onRetry }: Props) {
  const canRetry = onRetry && isRetryableError(error);
  return (
    <div className={styles.error}>
      <p role="alert">{getMessage(error)}</p>
      {canRetry && (
        <button className={styles.button} type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
