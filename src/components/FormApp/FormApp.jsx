import { useState } from "react";
import style from "./FormApp.module.css";
import useFormApp from "./useFormApp";
import { useNavigate } from "react-router-dom";

export default function FormApp() {
  const { handleSubmit, validateForm } = useFormApp();
  const navigate = useNavigate();
  
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checkboxValues, setCheckboxValues] = useState([]);
  const [region, setRegion] = useState("Μακεδονία");
  let errorText = validateForm(email, name, checkboxValues);
  const formData = { name, email, region, checkboxValues };
  
  
  return (
    // Κύριος περιέκτης που κρατά τις 2 μεγάλες στήλες
    <form
      className={style.formContainer}
      onSubmit={(e) => handleSubmit(e, errorText, navigate, formData)}
    >
      {/* ------------------- */}
      {/* ΣΤΗΛΗ 1: Η ΦΟΡΜΑ  */}
      {/* ------------------- */}
      <div className={style.formFields}>
        <p className={style.formInstruction}>
          (παρακαλώ συμπληρώστε με αγγλικούς χαρακτήρες)
        </p>

        {/* Κάθε 'formRow' είναι μια σειρά (ετικέτα + πεδίο) */}
        <div className={style.formRow}>
          <label htmlFor="name">Ονωματεπώνυμο:</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        <div className={style.formRow}>
          <label htmlFor="region">Περιοχή:</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            name="region"
            id="region"
            size="5"
          >
            <option value="Μακεδονία">Μακεδονία</option>
            <option value="Πελοπόννησος">Πελοπόννησος</option>
            <option value="Θράκη">Θράκη</option>
          </select>
        </div>

        <fieldset className={style.checkboxGroup}>
          <legend>Τομέας Ενδιαφέροντος (διαλέξτε όσους θέλετε):</legend>

          <div className={style.checkboxOptions}>
            <label>
              <input
                type="checkbox"
                name="interest"
                value="Αρχαιολογικοί χώροι"
                onChange={(e) => {
                  const value = e.target.value;
                  setCheckboxValues((prev) =>
                    e.target.checked
                      ? [...prev, value]
                      : prev.filter((v) => v !== value)
                  );
                }}
              />
              Αρχαιολογικοί χώροι
            </label>
            <label>
              <input
                type="checkbox"
                name="interest"
                value="Ακτές κολύμβησης"
                onChange={(e) => {
                  const value = e.target.value;
                  setCheckboxValues((prev) =>
                    e.target.checked
                      ? [...prev, value]
                      : prev.filter((v) => v !== value)
                  );
                }}
              />
              Ακτές κολύμβησης
            </label>
            <label>
              <input
                type="checkbox"
                name="interest"
                value="Φαγητό"
                onChange={(e) => {
                  const value = e.target.value;
                  setCheckboxValues((prev) =>
                    e.target.checked
                      ? [...prev, value]
                      : prev.filter((v) => v !== value)
                  );
                }}
              />
              Φαγητό
            </label>
          </div>
        </fieldset>

        <div className={style.formRow}>
          <label htmlFor="email">E-mail διεύθυνση:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        {/* Κοντέινερ για τα κουμπιά, ώστε να μπουν στη 2η στήλη */}
        <div className={style.buttonContainer}>
          <button type="submit" className={style.submitButton}>
            Υποβολή
          </button>

          <button
            type="reset"
            className={style.resetButton}
            onClick={() => {
              setName("");
              setEmail("");
              setCheckboxValues([]);
              setRegion("Μακεδονία");
            }}
          >
            Καθάρισμα
          </button>
        </div>
      </div>

      {/* Errors */}
      <div
        className={`${style.errorContainer} ${
          errorText ? style.errorState : style.validState
        }`}
      >
        <b>Σφάλματα:</b>
        <textarea
          readOnly
          rows="6"
          placeholder="No errors !"
          value={errorText}
        ></textarea>
      </div>
    </form>
  );
}
