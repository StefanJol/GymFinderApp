import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./MainHub.css";
import { API_URL } from "../config/api";

export default function Partners() {
  const [members, setMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (user) {
      loadMembers();
      loadPendingRequests();
    }
  }, []);

  const loadMembers = async () => {
    try {
      const res = await fetch(`${API_URL}/connections/members/${user.id}`);
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/connections/pending/${user.id}`);
      const data = await res.json();
      setPendingRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <main className="partners-container">
        <h1 style={{ color: "#000000" }}>Access Denied</h1>
      </main>
    );
  }

  const handleSendRequest = async (receiverId) => {
    try {
      const res = await fetch(`${API_URL}/connections/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user.id, receiverId }),
      });
      if (res.ok) {
        alert("Workout partner request sent!");
        loadMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptRequest = async (connectionId) => {
    try {
      const res = await fetch(`${API_URL}/connections/accept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId }),
      });
      if (res.ok) {
        alert("You are now workout partners!");
        loadPendingRequests();
        loadMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovePartner = async (partnerId) => {
    try {
      const res = await fetch(`${API_URL}/connections/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, partnerId }),
      });
      if (res.ok) {
        alert("Removed from your workout partners.");
        loadMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMockMessage = (username) => {
    alert(`Chatting feature coming soon! Send a direct text message to ${username}.`);
  };

  const filteredMembers = members.filter((member) =>
    member.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePartners = filteredMembers.filter((m) => m.connection_status === "accepted");
  const discoverableMembers = filteredMembers.filter((m) => m.connection_status !== "accepted");

  return (
    <main className="partners-container" style={{ color: "#000000" }}>
      
      <header className="hub-header">
        <img src="/logo.png" alt="Gym Logo" className="hub-logo" style={{ width: "250px", height: "auto", marginBottom: "15px" }} />
        <p style={{ color: "#000000", marginBottom: "15px", fontSize: "18px", fontWeight: "normal" }}>Connect with local athletes, schedule training meets, and locate local centers.</p>
        
        <button 
          onClick={() => navigate("/gyms")} 
          style={{ padding: "10px 20px", backgroundColor: "#ff9900", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
        >
          Search Gyms
        </button>
      </header>

      <section className="map-section">
        <h2 style={{ marginBottom: "15px", textAlign: "left", color: "#000000", fontSize: "22px", fontWeight: "bold" }}>Partner Training Gym Map Locations</h2>
        <div className="map-wrapper">
          <iframe 
            title="University Gym Locations Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2769.062828628045!2d14.48545831215456!3d46.04987079401735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47652d634281f6e9%3A0x6bda19b6711c79!2sFaculty%20of%20Computer%20and%20Information%20Science%2C%20University%20of%20Ljubljana!5e0!3m2!1sen!2ssi!4v1710000000000!5m2!1sen!2ssi" 
            width="100%" 
            height="320" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
          />
        </div>
      </section>

      <div className="search-box">
        <label htmlFor="search-partners" style={{ fontWeight: "bold", marginRight: "10px", color: "#000000", fontSize: "16px" }}>Search Directory: </label>
        <input
          id="search-partners"
          type="text"
          placeholder="Type a partner's name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
         
        />
      </div>

      <section style={{ marginBottom: "30px" }}>
        <h2 className="section-title-pending" style={{ color: "#000000", borderBottom: "2px solid #000000", fontSize: "22px", fontWeight: "bold", paddingBottom: "5px" }}>Incoming Pending Requests ({pendingRequests.length})</h2>
        {pendingRequests.length === 0 ? (
          <p style={{ color: "#000000", textAlign: "left", fontSize: "16px" }}>No incoming workout invitations right now.</p>
        ) : (
          pendingRequests.map((req) => (
            <div key={req.connection_id} className="request-card" style={{ borderLeft: "5px solid #000000" }}>
              <span style={{ color: "#000000", fontSize: "16px" }}><strong>{req.user_name}</strong> wants to train together!</span>
              <button onClick={() => handleAcceptRequest(req.connection_id)} className="btn-accept" style={{ backgroundColor: "#000000", color: "#ffffff", fontSize: "14px", fontWeight: "bold" }}>Accept Partner</button>
            </div>
          ))
        )}
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 className="section-title-active" style={{ color: "#000000", borderBottom: "2px solid #000000", fontSize: "22px", fontWeight: "bold", paddingBottom: "5px" }}>Connected Workout Partners ({activePartners.length})</h2>
        {activePartners.length === 0 ? (
          <p style={{ color: "#000000", textAlign: "left", fontSize: "16px" }}>You haven't added any official workout partners yet.</p>
        ) : (
          <div className="grid-container">
            {activePartners.map((partner) => (
              <div key={partner.id} className="partner-card" style={{ borderColor: "#000000" }}>
                <h3 style={{ margin: "5px 0", color: "#000000", fontSize: "20px", fontWeight: "bold" }}>{partner.user_name}</h3>
                <p style={{ margin: "5px 0", color: "#000000", fontSize: "15px" }}>{partner.user_email}</p>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button onClick={() => handleMockMessage(partner.user_name)} className="btn-message" style={{ backgroundColor: "#3498db", color: "#ffffff", fontSize: "14px", fontWeight: "bold" }}>Message</button>
                  <button onClick={() => handleRemovePartner(partner.id)} className="btn-remove" style={{ backgroundColor: "#e74c3c", color: "#ffffff", fontSize: "14px", fontWeight: "bold" }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2 className="section-title-discover" style={{ color: "#000000", borderBottom: "2px solid #000000", fontSize: "22px", fontWeight: "bold", paddingBottom: "5px" }}>Discover Gym Members ({discoverableMembers.length})</h2>
        {discoverableMembers.length === 0 ? (
          <p style={{ color: "#000000", textAlign: "left", fontSize: "16px" }}>No matching members found.</p>
        ) : (
          <div className="grid-container">
            {discoverableMembers.map((member) => (
              <div key={member.id} className="member-card">
                <h3 style={{ margin: "5px 0", color: "#000000", fontSize: "20px", fontWeight: "bold" }}>{member.user_name}</h3>
                <p style={{ margin: "5px 0", color: "#000000", fontSize: "15px" }}>{member.user_email}</p>
                <div style={{ marginTop: "12px" }}>
                  {member.connection_status === "pending" ? (
                    <button disabled className="btn-pending" style={{ color: "#ffffff", fontSize: "14px", fontWeight: "bold" }}>Request Pending</button>
                  ) : (
                    <button onClick={() => handleSendRequest(member.id)} className="btn-connect" style={{ backgroundColor: "#000000", color: "#ffffff", fontSize: "14px", fontWeight: "bold" }}>Send Connection Request</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer style={{ marginTop: "50px", borderTop: "1px solid #ccc", paddingGap: "20px", display: "flex", justifyContent: "center" }}>
        <button 
          onClick={handleLogout}
          style={{ padding: "10px 20px", backgroundColor: "#000000", color: "#ffffff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", marginTop: "20px" }}
        >
          Logout
        </button>
      </footer>

    </main>
  );
}