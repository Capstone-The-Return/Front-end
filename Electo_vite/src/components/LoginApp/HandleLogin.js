import users from "../../../db/users.json";



export function handleLogin({ email, password }) {
    let authentication = false;
    

    for (const user of users.users) {
      if (
        
        user.email === email &&
        user.password === password
      ) 
      {
        authentication = true;
        
        return {authentication, role: user.role};
      }         

    }
    if (!authentication) {
      return {authentication, role: null};
    }
    
};