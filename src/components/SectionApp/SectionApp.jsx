import style from "./SectionApp.module.css"
import citiesData from "../../assets/cities.json";

export default function SectionApp({ selectedCity }) {
  let description = citiesData[selectedCity].description;
  let title = citiesData[selectedCity].name;
  
  return (
    <section className={style.container}>
      <div className={style.content}>
        <h1 className={style.title}>{title}</h1>
        <p className={style.description}>{description}</p>
        <img
          className={style.img}
          src={citiesData[selectedCity].img}
          alt={title}
        />
      </div>
    </section>
  );
}
