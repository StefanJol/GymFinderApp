import { useState } from "react";
import { Link } from "react-router";
import "./Login.css";
import { API_URL } from "../config/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect to hub
        window.location.href = "/hub";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error logging in.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/logo.png" alt="Gym Logo" className="auth-logo" />
        <h1 className="auth-title" style={{ color: "#000000" }}>Sign In</h1>
        
        <form onSubmit={handleLoginSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              id="username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-input"
              required 
            />
          </div>

          <button type="submit" className="btn-login">Login</button>
        </form>

        {/* Register link  */}
        <p style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
          Don't have an account? <Link to="/register" style={{ color: "orange", fontWeight: "bold" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}