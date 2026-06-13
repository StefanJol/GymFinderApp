import { Link } from "react-router";

export default function Menu() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav>
      
      <Link to="/gyms">Gyms</Link>
      
      <Link to="/about">About</Link>

      {user ? (
        <>
        
          <span>Logged in as: {user.username}</span>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: "10px" }}>Login</Link>
          <Link to="/register" style={{ marginLeft: "10px" }}>Register</Link>
        </>
      )}
    </nav>
  );
}