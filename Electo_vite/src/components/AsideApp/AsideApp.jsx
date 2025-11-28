import style from "./AsideApp.module.css";
import { Link } from "react-router-dom";
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";

export default function AsideApp() {
  return (
    <aside className={style.container}>
      <nav className={style.nav}>
        <Link to="/home" className={style.link}>
          <FiHome className={style.icon} />
          <span>Αρχική</span>
        </Link>
        <Link to="/profile" className={style.link}>
          <FiUser className={style.icon} />
          <span>Προφίλ</span>
        </Link>
        <Link to="/settings" className={style.link}>
          <FiSettings className={style.icon} />
          <span>Ρυθμίσεις</span>
        </Link>
        <Link to="/logout" className={style.linkLogout}>
          <FiLogOut className={style.icon} />
          <span>Αποσύνδεση</span>
        </Link>
      </nav>
    </aside>
  );
}
