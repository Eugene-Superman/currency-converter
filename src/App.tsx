import styles from "./App.module.css";
import Converter from "./components/Converter/Converter";

function App() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Currency converter</h1>
      <div className={styles.card}>
        <Converter />
      </div>
    </main>
  );
}

export default App;
