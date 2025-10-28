import './admin-promote.css';
import React, { useState } from "react";

const AdminToevoegen: React.FC = () => {
  const [userId, setUserId] = useState<any>(); // slaat het id op dat ingevuld word in het input veld

  const [resultMessage, setResultMessage] = useState<string>(""); // slaat het resultaat bericht op na het klikken op de knop

  const handleUpgrade = () => {
    const roles = ["1", "2", "4", "7"]; 

    if (userId % 2 === 0 || roles.includes(userId)) {
      setResultMessage(`Gebruiker met userID ${userId} is nu admin.`);
    } else {
      setResultMessage("Gebruiker niet gevonden.");
    }
  };

  return (
    <>
    <div className="admin-promote-text-wrapper">
      <div className="admin-promote-text">
        <h1>Rol wijzigen naar admin</h1>
      </div>

      <div className="admin-promote-container">
        <div className="admin-promote-form-container">
          <label htmlFor="username" className="admin-promote-label">Welke gebruiker wilt u promoveren naar admin?</label>
          <input type="admin-promote-text" id="admin-promote-username" placeholder="Vul userID in" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <button className="admin-promote-upgrade-btn" onClick={handleUpgrade}>Rol wijzigen naar Admin</button>
          <p style={{ marginTop: "10px", color: "green" }}>{resultMessage}</p>
        </div>
      </div>
    </div>
    </>

  );
};

export default AdminToevoegen;