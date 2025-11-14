import FormApp from "./FormApp"
import AppBar from "../../components/AppBar/AppBar";
import FooterApp from "../../components/FooterApp/FooterApp";
import AsideApp from "../../components/AsideApp/AsideApp";
import NavigationApp from "../../components/NavigationApp/NavigationApp";
export default function FormPage() { 
    return (
      <>
        <AppBar text="Contact Form" />
        <div className="layout">
          <NavigationApp isform={true} />
          <FormApp />
          <AsideApp isform={true} />
        </div>
        <FooterApp />
      </>
    );
}
