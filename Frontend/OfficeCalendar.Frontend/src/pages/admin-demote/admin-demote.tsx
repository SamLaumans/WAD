import './admin-demote.css';
import React, { useState } from "react";

const AdminVerwijderen: React.FC = () => {
  const [userId, setUserId] = useState<string>(""); // slaat het id op dat ingevuld word in het input veld

  const [resultMessage, setResultMessage] = useState<string>(""); // slaat het resultaat bericht op na het klikken op de knop

  const handleDegrade = () => {

    if (userId === "1") {
      setResultMessage("Gebruiker met userID 1 is gedegradeert naar user.");
    } else {
      setResultMessage("Gebruiker niet gevonden.");
    }
  };

  return (
    <div className="admin-demote-text-wrapper">
      <div className="admin-demote-text">
        <h1>Rol wijzigen naar gebruiker</h1>
      </div>

      <div className="admin-demote-container">
        <div className="admin-demote-form-container">
          <label htmlFor="username" className="admin-demote-label">Welke gebruiker wilt u degraderen naar user?</label>
          <input type="admin-demote-text" id="admin-demote-username" placeholder="Vul userID in" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <button className="admin-demote-upgrade-btn" onClick={handleDegrade}>Rol wijzigen van Admin naar gewone gebruiker</button>
          <p style={{ marginTop: "10px", color: "green" }}>{resultMessage}</p>
        </div>
      </div>
    </div> 
  );
};

export default AdminVerwijderen;