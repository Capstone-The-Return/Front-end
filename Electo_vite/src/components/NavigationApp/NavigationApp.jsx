import { useState } from "react";
import { FiHome, FiUser, FiSettings, FiLogOut,FiFileText,FiSearch,FiList,FiTool, FiMenu } from "react-icons/fi";
  
import style from "./NavigationApp.module.css";

export default function NavigationApp() {
  const [open, setOpen] = useState(true);

  return (
    <nav className={`${style.container} ${open ? style.open : style.closed}`}>
      
      {/* Toggle Button */}
      <button className={style.toggleBtn} onClick={() => setOpen(!open)}>
        <FiMenu size={22} />
      </button>

      <ul className={style.menuList}>
        <li className={style.menuItem}>
          <FiHome className={style.icon} />
          {open && <span>Αρχική</span>}
        </li>

        <li className={style.menuItem}>
          <FiUser className={style.icon} />
          {open && <span>Προφίλ</span>}
        </li>
        <li className={style.menuItemLogout}>
          <FiFileText className={style.icon} />
          {open && <span>Υποβολή Αιτήματος</span>}
        </li>
        <li className={style.menuItemLogout}>
          <FiSearch  className={style.icon} />
          {open && <span>Παρακολούθηση Αιτήματος</span>}
        </li>
        <li className={style.menuItemLogout}>
          <FiList  className={style.icon} />
          {open && <span>Λίστα Αιτημάτων</span>}
        </li>
        <li className={style.menuItemLogout}>
          <FiTool className={style.icon} />
          {open && <span>Τεχνικό Κέντρο</span>}
        </li>
        <li className={style.menuItem}>
          <FiSettings className={style.icon} />
          {open && <span>Ρυθμίσεις</span>}
        </li>
        <li className={style.menuItemLogout}>
          <FiLogOut className={style.icon} />
          {open && <span>Αποσύνδεση</span>}
        </li>
      </ul>
    </nav>
  );
}


