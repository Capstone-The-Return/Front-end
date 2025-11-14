
import { useLocation, Link } from "react-router-dom";
import style from "./SuccessApp.module.css"; // Θα φτιάξουμε κι ένα απλό CSS

export default function SuccessApp() {
  // 1. Πάρε τα δεδομένα που στείλαμε από το 'navigate'
  const location = useLocation();
  const data = location.state;

  // 2. Έλεγχος αν τα δεδομένα ήρθαν (π.χ. αν κάποιος μπήκε στη σελίδα απευθείας)
  if (!data) {
    return (
      <div className={style.container}>
        <h1>Σφάλμα</h1>
        <p>Δεν βρέθηκαν δεδομένα.</p>
        <Link to="/">Επιστροφή στην αρχική</Link>
      </div>
    );
  }

  // 3. Δείξε τα δεδομένα
  return (
    <div className={style.container}>
      <h1>Επιτυχής Υποβολή!</h1>
      <p>
        Ευχαριστούμε, <strong>{data.name}</strong>.
      </p>

      <div className={style.summary}>
        <h3>Τα στοιχεία που υποβάλατε:</h3>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Περιοχή:</strong> {data.region}
        </p>
        <p>
          <strong>Ενδιαφέροντα:</strong>
        </p>
        <ul>
          {data.checkboxValues.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <Link to="/" className={style.backButton}>
        Επιστροφή
      </Link>
    </div>
  );
}
