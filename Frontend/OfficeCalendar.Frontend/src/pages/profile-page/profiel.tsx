import './Profiel.css';
import img1 from '../../assets/janjanssen.jpg';
import React, { useEffect, useState } from 'react';

const Profiel: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Grab the 'VIP Pass' from storage
    const token = localStorage.getItem('token');

    if (token) {
      // 2. Go to your "GetCurrentUser" endpoint
      fetch('https://localhost:xxxx/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // This is the crucial part
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => console.error("Could not fetch user", err));
    }
  }, []);

  return (
    <div className='admin-profile-text-wrapper'>
      <div className="admin-profile-text">
        <h1>Profiel</h1>
      </div>

      <div className="admin-profile-container">
        <div className='admin-profile-information-wrapper'>
          <img src={img1} alt="profiel" className="admin-profile-pic" />
          <div className="admin-profile-text2">
            <h2 className="admin-profile-heavy">{user.username}</h2>
            <h3 className="admin-profile-light">{user.email}</h3>
            <h3 className="admin-profile-light">{user.nickname}</h3>
            <h3 className="admin-profile-light">{user.creation_date}</h3>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profiel;