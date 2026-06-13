import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

export default function Gyms() {
  const [city, setCity] = useState("");
  const [gyms, setGyms] = useState([]);
  const [favorites, setFavorites] = useState([]);

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
      <main style={{ padding: "20px" }}>
        <h1>Access Denied</h1>
        <p>Please log in to manage your favorites.</p>
      </main>
    );
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/gyms?city=${city}`);
    const data = await res.json();
    setGyms(data);
  };

  const handleFavorite = async (gymId) => {
    await fetch(`${API_URL}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, gymId }),
    });
    loadFavorites();
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Find a Gym</h1>
      <form onSubmit={handleSearch}>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
        <button type="submit">Search</button>
      </form>

      <section style={{ marginTop: "20px" }}>
        {gyms.map((gym) => (
          <div key={gym.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px 0" }}>
            <h3>{gym.name} <button onClick={() => handleFavorite(gym.id)}>❤️ Favorite</button></h3>
          </div>
        ))}
      </section>

      <h2>My Bookmarked Gyms</h2>
      <section style={{ background: "#f9f9f9", padding: "10px", borderRadius: "5px" }}>
        {favorites.length === 0 ? <p>No bookmarks yet.</p> : favorites.map((gym) => (
          <p key={gym.id}>⭐ {gym.name} ({gym.city})</p>
        ))}
      </section>
    </main>
  );
}