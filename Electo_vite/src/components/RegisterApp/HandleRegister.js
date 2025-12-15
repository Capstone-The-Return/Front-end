import users from "../../../db/users.json";

function addUser(name, email, password) {
  const newUser = {
    id: users.users.length + 1,
    name: name,
    email: email,
    password: password,
    role: "user",
  };
  users.users.push(newUser); // Note: It does not persist to the JSON file as this is a mock database.
}
function isEmailRegistered(email) {
  for (const user of users.users) {
    if (user.email === email) {
      return true;
    }
  }
  return false;
}

export function handleRegister(name, email, password, confirmPassword) {
  if (password !== confirmPassword) {
    return { isSuccess: false, message: "Passwords do not match." };
  }
  if (isEmailRegistered(email)) {
    return { isSuccess: false, message: "Email is already registered." };
  } else {
    addUser(name, email, password);
    return { isSuccess: true, message: "Registration successful." };
  }
}
