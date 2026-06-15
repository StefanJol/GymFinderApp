import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000"; // Swap to university URL after finishing project with docker DO NOT FORGETTTT

export default function Partners() {
  const [members, setMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  if (!user) {
    return (
      <main>
        <h1>Access Denied</h1>
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
        loadMembers(); // Refresh to update list status
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
        loadMembers(); // Move them into the active partners list
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
        loadMembers(); // Refresh list to put them back in discoverable view
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMockMessage = (username) => {
    alert(`Chatting feature coming soon! Send a direct text message to ${username}.`);
  };

  // Filter out profiles based on your search query bar typing input
  const filteredMembers = members.filter((member) =>
    member.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePartners = filteredMembers.filter((m) => m.connection_status === "accepted");
  const discoverableMembers = filteredMembers.filter((m) => m.connection_status !== "accepted");

  return (
    <main>
      <h1>Workout Partner Connections</h1>

      {/* Search Input field */}
      <div>
        <label htmlFor="search-partners">Search members: </label>
        <input
          id="search-partners"
          type="text"
          placeholder="Type a name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Pending Requests Notification Alerts */}
      <section>
        <h2>Pending Partner Requests ({pendingRequests.length})</h2>
        {pendingRequests.length === 0 ? (
          <p>No incoming invitations at the moment.</p>
        ) : (
          pendingRequests.map((req) => (
            <div key={req.connection_id}>
              <span>🤝 <strong>{req.user_name}</strong> wants to train with you!</span>
              <button onClick={() => handleAcceptRequest(req.connection_id)}>Accept</button>
            </div>
          ))
        )}
      </section>

      {/* Active Confirmed Workout Partners Column */}
      <section>
        <h2>My Workout Partners ({activePartners.length})</h2>
        {activePartners.length === 0 ? (
          <p>You haven't added any official workout partners yet.</p>
        ) : (
          activePartners.map((partner) => (
            <div key={partner.id}>
              <h3>💚 {partner.user_name}</h3>
              <p>Email: {partner.user_email}</p>
              <button onClick={() => handleMockMessage(partner.user_name)}>💬 Message</button>
              <button onClick={() => handleRemovePartner(partner.id)}>❌ Remove Partner</button>
            </div>
          ))
        )}
      </section>

      {/* General Directory Discovery Column */}
      <section>
        <h2>Discover Gym Members ({discoverableMembers.length})</h2>
        {discoverableMembers.length === 0 ? (
          <p>No other members match your criteria.</p>
        ) : (
          discoverableMembers.map((member) => (
            <div key={member.id}>
              <h3>👤 {member.user_name}</h3>
              <p>Email: {member.user_email}</p>
              {member.connection_status === "pending" ? (
                <button disabled>⏳ Request Pending</button>
              ) : (
                <button onClick={() => handleSendRequest(member.id)}>Send Connection Request</button>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
}