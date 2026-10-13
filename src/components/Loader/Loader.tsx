import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <p className={styles.loader} role="status">
      Loading...
    </p>
  );
}
