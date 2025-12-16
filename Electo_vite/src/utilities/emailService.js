import emailjs from "@emailjs/browser";


export async function sendAnEmail(recipient, subject, message) {
  const serviceID = "electronics_support";
  // Best practice: Use process.env.REACT_APP_SERVICE_ID here instead WEE NEED TO HIDE OUR KEYS

  const templateID = "template_vkobo7x";
  const publicKey = "dQ4Am0pI93KkA8sZ6";

  const templateParams = {
    to_email: recipient,
    subject: subject,
    message: message,
  };

  try {
    // We use await here, so the function must be marked 'async'
    const response = await emailjs.send(
      serviceID,
      templateID,
      templateParams,
      publicKey
    );
    console.log("Email sent successfully", response);
    return response;
  } catch (error) {
    console.error("Error sending email", error);
    throw error;
  }
}

