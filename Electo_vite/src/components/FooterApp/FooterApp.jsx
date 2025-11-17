import style from "./FooterApp.module.css"
export default function FooterApp() {
  return (
    <footer className={style.container}>
      <p>Electro Team © Copyright Ελλάδα {new Date().getFullYear()}</p>
    </footer>
  );
};
