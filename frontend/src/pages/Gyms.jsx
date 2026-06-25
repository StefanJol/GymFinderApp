import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Gyms.css";
import { API_URL } from "../config/api";

export default function Gyms() {
  const [city, setCity] = useState("");
  const [gyms, setGyms] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  // Review form states
  const [activeGymId, setActiveGymId] = useState(null);
  const [gymReviews, setGymReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Admin states for adding a new gym
  const [newGymName, setNewGymName] = useState("");
  const [newGymCity, setNewGymCity] = useState("");

  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (user) loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await fetch(`${API_URL}/favorites/${user.id}`);
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <main className="gyms-container">
        <h1>Access Denied</h1>
      </main>
    );
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/gyms?city=${city}`);
    const data = await res.json();
    setGyms(data);
    setActiveGymId(null); 
  };

  const handleFavorite = async (gymId) => {
    await fetch(`${API_URL}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, gymId }),
    });
    loadFavorites();
  };

  const handleUnfavorite = async (gymId) => {
    await fetch(`${API_URL}/favorites`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, gymId }),
    });
    loadFavorites(); 
  };

  const handleOpenReviews = async (gymId) => {
    setActiveGymId(gymId);
    setComment("");
    setRating(5);
    try {
      const res = await fetch(`${API_URL}/reviews/gym/${gymId}`);
      const data = await res.json();
      setGymReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e, gymId) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, gymId, rating, comment }),
      });
      if (res.ok) {
        handleOpenReviews(gymId); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGym = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/gyms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGymName, city: newGymCity }),
      });
      if (res.ok) {
        setNewGymName("");
        setNewGymCity("");
        alert("Gym added successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateAverage = (reviews) => {
    if (reviews.length === 0) return "No ratings yet";
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return `${(total / reviews.length).toFixed(1)} / 5`;
  };

  return (
    <main className="gyms-container">
      
      <header className="gyms-header">
        <h1 className="gyms-title">Find a Gym</h1>
        <button onClick={() => navigate("/hub")} className="btn-back">
          Back to Hub
        </button>
      </header>

      {user.role === "admin" && (
        <>
          <section className="admin-section">
            <h2 className="admin-title">Admin Panel: Add a New Gym</h2>
            <form onSubmit={handleAddGym} className="admin-form">
              <input type="text" value={newGymName} onChange={(e) => setNewGymName(e.target.value)} placeholder="Gym Name" required className="admin-input" />
              <input type="text" value={newGymCity} onChange={(e) => setNewGymCity(e.target.value)} placeholder="City Location" required className="admin-input" />
              <button type="submit" className="btn-admin-add">Add Gym</button>
            </form>
          </section>
          <hr className="admin-divider" />
        </>
      )}

      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Enter City..." 
          className="search-input"
        />
        <button type="submit" className="btn-search">Search</button>
      </form>

      <section className="gyms-list">
        {gyms.map((gym) => (
          <div key={gym.id} className="gym-card">
            <h3 className="gym-card-title">
              {gym.name} 
              <button onClick={() => handleFavorite(gym.id)} className="btn-action">Favorite</button>
              <button onClick={() => handleOpenReviews(gym.id)} className="btn-action">Reviews</button>
            </h3>
            <p className="gym-location">Location: {gym.city}</p>

            {activeGymId === gym.id && (
              <div className="reviews-container">
                <h4 className="reviews-summary">Gym Rating Summary: {calculateAverage(gymReviews)}</h4>
                
                <div className="reviews-list">
                  {gymReviews.length === 0 ? <p>No comments yet. Be the first!</p> : gymReviews.map((rev) => (
                    <div key={rev.id} className="review-item">
                      <strong>{rev.user_name} ({rev.rating} / 5):</strong> {rev.comment}
                    </div>
                  ))}
                </div>

                <form onSubmit={(e) => handleSubmitReview(e, gym.id)} className="review-form">
  <select 
    value={rating} 
    onChange={(e) => setRating(e.target.value)} 
    className="review-select"
  >
    <option value="5">5</option>
    <option value="4">4</option>
    <option value="3">3</option>
    <option value="2">2</option>
    <option value="1">1</option>
  </select>
  
  <input 
    type="text" 
    value={comment} 
    onChange={(e) => setComment(e.target.value)} 
    placeholder="Write a public comment..." 
    className="review-input"
  />
  
  <button type="submit" className="btn-post-review">Post</button>
</form>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="bookmarks-section">
        <h2 className="bookmarks-title">My Bookmarked Gyms</h2>
        {favorites.length === 0 ? (
          <p>No bookmarks yet.</p>
        ) : (
          favorites.map((gym) => (
            <div key={gym.id} className="bookmark-item">
              <span className="bookmark-text">{gym.name} ({gym.city})</span>
              <button onClick={() => handleUnfavorite(gym.id)} className="btn-remove-bookmark">Remove</button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}