import './admin-role-adjustment.css';
import React, { useState, useEffect } from "react";

const ROLE_MAP: Record<number, string> = {
  0: "user",
  1: "moderator",
  2: "admin"
};

const ROLE_REVERSE: Record<string, number> = {
  "user": 0,
  "moderator": 1,
  "admin": 2
};

const AdminRolBeheer: React.FC = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [newRole, setNewRole] = useState("user");

  // 🔍 Fetch server-side search results
  useEffect(() => {
    if (search.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    fetch(`http://localhost:5267/api/SearchUsers?query=${encodeURIComponent(search)}`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => setSuggestions(data))
      .catch(err => {
        if (err.name !== "AbortError") console.error("Error fetching suggestions:", err);
      });

    return () => controller.abort();
  }, [search]);

  const handleSelectUser = (u: any) => {
    setSelectedUser(u);
    setNewRole(ROLE_MAP[u.role]);
    setSearch("");  // close suggestions
    setSuggestions([]);
  };

  const handleUpdate = () => {
    if (!selectedUser) return;

    fetch("http://localhost:5267/api/AdjustRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: selectedUser.username,
        newRole: ROLE_REVERSE[newRole]
      })
    })
      .then(async res => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg);
        }
        return res.json();
      })
      .then(updatedUser => {
        alert(`Rol van ${updatedUser.username} bijgewerkt naar: ${ROLE_MAP[updatedUser.role]}`);
        setSelectedUser(updatedUser);
      })
      .catch(err => console.error("Error updating role:", err));
  };

  return (
    <div className="admin-demote-text-wrapper">
      <div className="admin-demote-text">
        <h1>Rolbeheer</h1>
      </div>

      <div className="admin-demote-container">
        <div className="admin-demote-form-container">
          <label>Zoek gebruiker:</label>

          <input
            type="text"
            placeholder="Username..."
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "400px", padding: "8px" }}
          />

          {/* 🔽 Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div id="suggestions" className="card">
              {suggestions.map((u) => (
                <div
                  key={u.username}
                  onClick={() => handleSelectUser(u)}
                  className="suggestion-item"
                >
                  {u.username}
                </div>
              ))}
            </div>
          )}

          {/* 👤 Selected user card */}
          {selectedUser && (
            <div id="selected-user" className="card">
              <h3>Geselecteerde gebruiker</h3>
              <p><b>Username:</b> {selectedUser.username}</p>
              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Huidige rol:</b> {ROLE_MAP[selectedUser.role]}</p>

              <label>Nieuwe rol:</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="role-select"
              >
                <option value="admin">admin</option>
                <option value="moderator">moderator</option>
                <option value="user">user</option>
              </select>

              <button onClick={handleUpdate} className="update-role-btn">
                Update rol
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminRolBeheer;
