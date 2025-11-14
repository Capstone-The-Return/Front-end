import style from "./AsideApp.module.css";
import { Link } from "react-router-dom";

export default function AsideApp({ isform }) {
  let content;
  if (!isform) {
    content = (
      <aside className={style.container}>
        <Link to="/form">
          <button className={`${style.mybutton} my-button`}>
            Παμε στη φορμα
          </button>
        </Link>
      </aside>
    );
  } else if (isform) {
    content = (
      <aside className={style.container}>
        <Link to="/">
          <button className={`${style.mybutton} my-button`}>Πίσω</button>
        </Link>
      </aside>
    );
  }

  return content;
}
