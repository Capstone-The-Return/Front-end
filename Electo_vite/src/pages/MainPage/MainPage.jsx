import AppBar from "../../components/AppBar/AppBar";
import FooterApp from "../../components/FooterApp/FooterApp";
import MainPageApp from "../../components/MainPageApp/MainPageApp";
import style from "./MainPage.module.css";
import NavigationApp from "../../components/NavigationApp/NavigationApp";
import AsideApp from "../../components/AsideApp/AsideApp";

export default function MainPage() {
  return (
    <>
      <AppBar />
      <div className={style.layout}>
        <NavigationApp />
        <MainPageApp />
        <AsideApp />
      </div>
      <FooterApp />
      
      
    </>
  );
}