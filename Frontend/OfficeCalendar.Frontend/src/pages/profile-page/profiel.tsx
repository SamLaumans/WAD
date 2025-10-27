import React from 'react';
import './Profiel.css';
import img1 from '../../assets/janjanssen.jpg';


const Profiel: React.FC = () => {
  return (
    <div className='admin-profile-text-wrapper'>
      <div className="admin-profile-text">
        <h1>Profiel</h1>
      </div>

      <div className="admin-profile-container">
        <div className='admin-profile-information-wrapper'>
          <img src={img1} alt="profiel" className="admin-profile-pic" />
          <div className="admin-profile-text2">
            <h2 className="admin-profile-heavy">Jan Jansen</h2>
            <h3 className="admin-profile-light">voorbeeldfunctie</h3>
            <h3 className="admin-profile-light">janjansen@voorbeeldmail.nl</h3>
            <h3 className="admin-profile-light">06 12 34 56 78</h3>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profiel;