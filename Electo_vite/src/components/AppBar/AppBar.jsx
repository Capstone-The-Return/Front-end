import styles from "./AppBar.module.css";
import electronicsIcon from "../../assets/electronics_icon.png";

export default function AppBar() {
  return (
    <header className={styles.container}>
      <a href="/login" aria-label="Go to login page">
        <img src={electronicsIcon} className={styles.icon} alt="Electronics Icon" />
      </a>
      <h1 className={styles.headertext}>Electronics Portal</h1>
    </header>
  );
}

