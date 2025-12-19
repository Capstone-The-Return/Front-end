import AppBar from "../../components/AppBar/AppBar";
import FooterApp from "../../components/FooterApp/FooterApp";
import NavigationApp from "../../components/NavigationApp/NavigationApp";

import CustomerViewRequestApp from "../../components/CustomerViewRequestApp/CustomerViewRequestApp";
import style from "./CustomerViewRequest.module.css";

export default function CustomerViewRequest() {
  return (
    <>
      <AppBar />

      <div className={style.layout}>
        <NavigationApp />

        <main className={style.content}>
          <CustomerViewRequestApp />
        </main>
      </div>

      <FooterApp />
    </>
  );
}
