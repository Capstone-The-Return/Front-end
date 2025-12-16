import users from "../../../db/users.json";
import { resetPasswordEmail } from "../../utilities/emailService";

export function passwordResetHandle({ email }) {
  for (const user of users.users) {
    if (user.email === email) {
      // In a real application, here you would trigger the password reset email
      resetPasswordEmail({ email }, "Password Reset Request", "testlink12345 ");
      return;
    }

    return;
  }
}
