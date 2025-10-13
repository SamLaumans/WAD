import './AdminToevoegen.css';
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
  <div>
    <div className="topbar">
      <a className="active" href="#home">Home</a>
      <a href="#agenda">Agenda</a>
      <a href="#contact">Contact</a>
      <a href="#about">About</a>
    </div>
    
    <div className="text">
        <h1>Rol wijzigen naar admin</h1>
    </div>

    <div className="container">
        <div className="form-container">
            <label htmlFor="username" className="label">UserID:</label>
            <input type="text" id="username" placeholder="Vul userID in" value={userId} onChange={(e) => setUserId(e.target.value)}/>
            <button className="upgrade-btn" onClick={handleUpgrade}>Rol wijzigen naar Admin</button>
            <p style={{ marginTop: "10px", color: "green" }}>{resultMessage}</p>
        </div>
    </div>
    </div>
  );
};

export default AdminToevoegen;