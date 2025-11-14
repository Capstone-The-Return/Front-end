import styles from "./AppBar.module.css";
export default function AppBar({text}) {
  return (
    <header className={styles.container}>
      <h1 className={styles.headertext}>Pasok</h1>
    </header>
  );
}
