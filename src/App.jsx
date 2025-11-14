import './App.css'
import SectionApp from "./components/SectionApp/SectionApp";
import FooterApp from "./components/FooterApp/FooterApp";
import AppBar from "./components/AppBar/AppBar";
import NavigationApp from "./components/NavigationApp/NavigationApp";
import AsideApp from "./components/AsideApp/AsideApp";
import "./index.css";
import { useState } from 'react'; 

function App() {
  const [currentCity, setCurrentCity] = useState("thessaloniki");
  

  return (
    <>
      <AppBar text="Πόλεις της Ελλάδας" />
      <div className="layout">
        <NavigationApp onCitySelect={setCurrentCity} />
        <SectionApp selectedCity={currentCity} />
        <AsideApp />
      </div>
      <FooterApp />
    </>
  );
}

export default App
