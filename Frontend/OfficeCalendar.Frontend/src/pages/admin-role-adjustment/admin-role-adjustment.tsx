import './admin-role-adjustment.css';
import React, { useState } from "react";

const AdminRolBeheer: React.FC = () => {
  const users = [
    { username: "jansen1", email: "j1@example.com", role: "user" },
    { username: "jansen2", email: "j2@example.com", role: "moderator" },
    { username: "janssen_p", email: "jp@example.com", role: "user" }
  ];

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<null | any>(null);
  const [newRole, setNewRole] = useState("user");

  const suggestions = search
    ? users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleSelectUser = (u: any) => {
    setSelectedUser(u);
    setNewRole(u.role);
  };

  const handleUpdate = () => {
    alert(`Rol van ${selectedUser.username} bijgewerkt naar: ${newRole}`);
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

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div id="suggestions" className="card">
            {suggestions.map((u) => (
            <div key={u.username} onClick={() => handleSelectUser(u)}>
            {u.username}
            </div>
           ))}
          </div>
          )}

          {/* User Info Card */}
        {selectedUser && (
          <div id="selected-user" className="card">
            <h3>Geselecteerde gebruiker</h3>
            <p>
              <b>Username:</b> {selectedUser.username}
            </p>
            <p>
              <b>Email:</b> {selectedUser.email}
            </p>
            <p>
              <b>Huidige rol:</b> {selectedUser.role}
            </p>

            <label>Nieuwe rol:</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="role-select"
            >
              <option>admin</option>
              <option>moderator</option>
              <option>user</option>
            </select>

            <button
              onClick={handleUpdate}
              className="update-role-btn"
            >
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