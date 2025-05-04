import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Manually triggered login function
  const handleLoginClick = () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    
    const user = { email };
    setCurrentUser(user); // Save user into app state
    navigate("/dashboard"); // Redirect after login
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <div className="login-form">
        {/* Email input */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

      </div>
    </div>
  );
}

export default Login;
