import style from "./NavigationApp.module.css"
import { Link } from "react-router-dom";
export default function NavigationApp({ onCitySelect, isform }) {
  let content;

  if (!isform) {
    content = (
      <nav className={style.container}>
        <button
          className={`${style.mybutton} my-button`}
          onClick={() => onCitySelect("thessaloniki")}
        >
          Θεσσαλονίκη
        </button>
        <button
          className={`${style.mybutton} my-button`}
          onClick={() => onCitySelect("athens")}
        >
          Αθήνα
        </button>
        <button
          className={`${style.mybutton} my-button`}
          onClick={() => onCitySelect("katerini")}
        >
          Κατερίνη
        </button>
      </nav>
    );
  } else if (isform) {
    content = (
      <nav className={style.container}>
        <p className={style.message}>Thank you for visiting the form page.</p>
      </nav>
    );
  }

  return content;
}
