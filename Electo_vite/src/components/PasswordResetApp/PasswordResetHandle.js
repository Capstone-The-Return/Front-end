import users from "../../../db/users.json";
import { sendAnEmail } from "../../utilities/emailService";

export function passwordResetHandle({ email }) {
  for (const user of users.users) {
    if (user.email === email) {
      // In a real application, here you would trigger the password reset email
      sendAnEmail(
        { email },
        "Password Reset Request",
        "Please reset your password using the following link: [reset link]"
      );
      console.log(`Password reset link sent to ${email}`);
      return;
    }

    return;
  }
}
