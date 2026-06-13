import { useState } from "react";

const API_URL = "http://localhost:5000";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Sending request...");

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Success: User registered!");
      } else {
        setMessage(`Error: ${data.message || "Registration failed"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("Error: Could not connect to backend server.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Register</h1>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>

        {message && (
          <p className="status-message" style={{ marginTop: '15px', color: message.startsWith('Success') ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </section>
    </main>
  );
}