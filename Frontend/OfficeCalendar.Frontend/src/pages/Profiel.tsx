import React from 'react';
import './Profiel.css';

const Profiel: React.FC = () => {
  return (
    <div>
        <div className="topbar">
        <a className="active" href="#home">Home</a>
        <a href="#agenda">Agenda</a>
        <a href="#contact">Contact</a>
        <a href="#about">About</a>
        </div>

        <div className="text">
        <h1>Profiel</h1>
        </div>

        <div className="container">
        <img src="profiel.png" alt="profiel" className="profile-pic"/>
        <div className="text2">
            <h2 className="heavy">Jan Jansen</h2>
            <h3 className="light">voorbeeldfunctie</h3>
            <h3 className="light">janjansen@voorbeeldmail.nl</h3>
            <h3 className="light">06 12 34 56 78</h3>
        </div>
        </div>

    </div>
  );
};

export default Profiel;