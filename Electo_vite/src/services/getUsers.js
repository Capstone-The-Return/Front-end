const BASE = "http://localhost:4000/users";

export const getAllUsers = async () => {
  const res = await fetch(BASE);
  
  return res.json();
};