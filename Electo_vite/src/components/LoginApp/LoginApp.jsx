import React, { useState } from "react";
import style from "./LoginApp.module.css";

export default function LoginApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the page from reloading

    // TODO: Implement your login logic here
    // For example, send data to an API
    console.log("Login attempt with:", { email, password });

    // You would typically handle success/error states here
  };

  return (
    <div className={style.loginContainer}>
      <form onSubmit={handleSubmit} className={style.loginForm}>
        <h2>Login</h2>

        <div className={style.inputGroup}>
          <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />

        </div>

        <div className={style.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

        </div>

        <button type="submit" className={style.loginButton}>
          Login
        </button>
      </form>
    </div>
  );
}
