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

      {user ? (
        <>
          <Link to="/partners">Find Partners</Link>
          <span>Logged in as: {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}