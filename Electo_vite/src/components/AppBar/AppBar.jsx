import styles from "./AppBar.module.css";
import electronicsIcon from "../../assets/electronics_icon.png";

export default function AppBar() {
  return (
    <header className={styles.container}>
        <img src={electronicsIcon} className={styles.icon} alt="Electronics Icon" />
      <h1 className={styles.headertext}>Electronics Portal</h1>
    </header>
  );
}

