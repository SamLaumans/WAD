import './admin-promote.css';
import React, { useState } from "react";

const AdminToevoegen: React.FC = () => {
  const [userId, setUserId] = useState<string>("");

  const [resultMessage, setResultMessage] = useState<string>("");

  const handleUpgrade = () => {

    if (userId === "1") {
      setResultMessage("Gebruiker met userID 1 is nu admin.");
    } else {
      setResultMessage("Gebruiker niet gevonden.");
    }
  };

  return (
    <>
      <div className="admin-promote-text">
        <h1>Rol wijzigen naar admin</h1>
      </div>

      <div className="admin-promote-container">
        <div className="admin-promote-form-container">
          <label htmlFor="username" className="admin-promote-label">UserID:</label>
          <input type="admin-promote-text" id="admin-promote-username" placeholder="Vul userID in" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <button className="admin-promote-upgrade-btn" onClick={handleUpgrade}>Rol wijzigen naar Admin</button>
          <p style={{ marginTop: "10px", color: "green" }}>{resultMessage}</p>
        </div>
      </div>
    </>

  );
};

export default AdminToevoegen;