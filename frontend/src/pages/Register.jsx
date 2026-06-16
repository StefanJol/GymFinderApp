import { useState } from "react";
import "./Register.css";

const API_URL = "http://localhost:5000";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Registration successful! Please login.");
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error registering user.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/logo.png" alt="Gym Logo" className="auth-logo" />
        <h1 className="auth-title">Create Account</h1>
        
        <form onSubmit={handleRegisterSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-username" className="form-label">Username</label>
            <input 
              id="reg-username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="form-input"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address</label>
            <input 
              id="reg-email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <input 
              id="reg-password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-input"
              required 
            />
          </div>

          <button type="submit" className="btn-register">Register Account</button>
        </form>
      </div>
    </div>
  );
}