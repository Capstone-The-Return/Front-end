import AppBar from "../../components/AppBar/AppBar";
import FooterApp from "../../components/FooterApp/FooterApp";
import MainPageApp from "../../components/MainPageApp/MainPageApp";
import style from "./MainPage.module.css";
import NavigationApp from "../../components/NavigationApp/NavigationApp";


export default function MainPage() {
  return (
    <>
      <AppBar />
      <div className={style.layout}>
        <NavigationApp />
        <MainPageApp />
      </div>
      <FooterApp />
      
      
    </>
  );
}