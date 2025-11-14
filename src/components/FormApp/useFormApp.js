export default function useFormApp() {
  /**
   * Χειρίζεται την υποβολή της φόρμας.
   * @param {Event} event - Το browser event
   * @param {string} errorText - Το κείμενο με τα σφάλματα (αν υπάρχουν)
   * @param {Function} navigate - Η συνάρτηση navigate του React Router
   * @param {Object} formData - Τα δεδομένα της φόρμας (name, email, κλπ.)
   */
  function handleSubmit(event, errorText, navigate, formData) {
    event.preventDefault();
    if (errorText.length === 0) {
      // 3. ΑΝ ΕΙΝΑΙ ΚΕΝΟ: Κάνε redirect στη νέα σελίδα
      //    και στείλε τα formData μέσω του 'state'
      console.log("Form is valid. Redirecting...");
      navigate("/success", { state: formData });
    } else {
      // 4. ΑΝ ΔΕΝ ΕΙΝΑΙ ΚΕΝΟ: Μην κάνεις τίποτα.
      //    (Το textarea σφαλμάτων θα δείχνει ήδη τα λάθη)
      console.log("Form is invalid. Not submitting.");
    }
  }

  function validateForm(email, name, checkboxValues) {
    let errorMessages = "";

    if (email.length === 0 || name.length === 0) {
      errorMessages += "Το όνομα και το email είναι υποχρεωτικά πεδία.\n \n";
    }
    if (!email.endsWith(".gr")) {
      errorMessages +=
        "Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email με κατάληξη (.gr).\n \n";
    }
    if (checkboxValues.length === 0) {
      errorMessages +=
        "Παρακαλώ επιλέξτε τουλάχιστον ένα πεδίο ενδιαφέροντος.\n \n";
    }

    return errorMessages;
  }

  return { handleSubmit, validateForm };
}