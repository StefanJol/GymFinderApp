import { Link } from "react-router";

export default function Menu() {
  // Get the logged in user string from local storage
  const userString = localStorage.getItem("user");
  // Convert it back into a JavaScript object if it exists
  const user = userString ? JSON.parse(userString) : null;

  // Simple function to clear local storage and log out
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav>
      <Link to="/news">News</Link>
      
      {/* If user exists AND user role is admin, show this link */}
      {user && user.role === "admin" && (
        <Link to="/create-news">Create News</Link>
      )}
      
      <Link to="/about">About</Link>

      {/* If logged in, show username and logout button. Otherwise show Login/Register */}
      {user ? (
        <>
          <span>{user.username} ({user.role})</span>
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