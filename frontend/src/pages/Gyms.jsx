import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

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
      <main>
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

  // Admin function to create a new gym entry
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
    return `⭐ ${(total / reviews.length).toFixed(1)} / 5`;
  };

  return (
    <main>
      {/* Admin Panel Panel Section */}
      {user.role === "admin" && (
        <section>
          <h2>Admin Panel: Add a New Gym</h2>
          <form onSubmit={handleAddGym}>
            <input type="text" value={newGymName} onChange={(e) => setNewGymName(e.target.value)} placeholder="Gym Name" required />
            <input type="text" value={newGymCity} onChange={(e) => setNewGymCity(e.target.value)} placeholder="City Location" required />
            <button type="submit">Add Gym</button>
          </form>
        </section>
      )}

      <h1>Find a Gym</h1>
      <form onSubmit={handleSearch}>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
        <button type="submit">Search</button>
      </form>

      <section>
        {gyms.map((gym) => (
          <div key={gym.id}>
            <h3>
              {gym.name} 
              <button onClick={() => handleFavorite(gym.id)}>❤️ Favorite</button>
              <button onClick={() => handleOpenReviews(gym.id)}>💬 Reviews</button>
            </h3>
            <p>Location: {gym.city}</p>

            {activeGymId === gym.id && (
              <div>
                <h4>Gym Rating Summary: {calculateAverage(gymReviews)}</h4>
                
                <div>
                  {gymReviews.length === 0 ? <p>No comments yet. Be the first!</p> : gymReviews.map((rev) => (
                    <div key={rev.id}>
                      <strong>{rev.user_name} ({rev.rating}⭐):</strong> {rev.comment}
                    </div>
                  ))}
                </div>

                <form onSubmit={(e) => handleSubmitReview(e, gym.id)}>
                  <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="5">5 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="1">1 ⭐</option>
                  </select>
                  <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a public comment..." />
                  <button type="submit">Post</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </section>

      <h2>My Bookmarked Gyms</h2>
      <section>
        {favorites.length === 0 ? <p>No bookmarks yet.</p> : favorites.map((gym) => (
          <p key={gym.id}>
            ⭐ {gym.name} ({gym.city})
            <button onClick={() => handleUnfavorite(gym.id)}>❌ Remove</button>
          </p>
        ))}
      </section>
    </main>
  );
}