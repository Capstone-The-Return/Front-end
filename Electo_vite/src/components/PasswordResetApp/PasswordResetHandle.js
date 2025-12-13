import users from "../../../db/users.json";

export function passwordResetHandle({ email }) {
    for (const user of users.users) {
      if (user.email === email) {
        // In a real application, here you would trigger the password reset email  
        console.log(`Password reset link sent to ${email}`); 
        return ;
      }

  return ;
 }
};
