import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Profiel from '../profile-page/profiel';
import './Toolbar.css';
import img1 from '../../assets/blank_profile.jpg';
import MessagePopup from '../../components/MessagePopup';

const Toolbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [showMessages, setShowMessages] = useState(false);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <>
            <div className="toolbar">

                {/* Your existing links */}
                <Link to="/main-page" className={location.pathname === '/main-page' ? 'active' : ''}>Home</Link>
                <Link to="/weekplanner" className={location.pathname === '/weekplanner' ? 'active' : ''}>Week Planner</Link>
                <Link to="/monthdayview" className={location.pathname === '/monthdayview' ? 'active' : ''}>Maand Planner</Link>
                <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>

                <div className='toolbar-right'>
                    <span
                        className="toolbar-message-icon"
                        onClick={() => setShowMessages(true)}
                        title="Messages"
                    >
                        ✉
                    </span>

                    <img  //profiel foto
                        src={img1}
                        alt="profile"
                        className="toolbar-profile-pic"
                        onClick={() => setShowProfile(true)}
                    />
                </div>
            </div>

            {showProfile && ( //popup
                <div className="profile-modal-overlay">
                    <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowProfile(false)}>×</button>
                        <Profiel />
                    </div>
                </div>
            )}

            {showMessages && (
                <div className="message-overlay" onClick={() => setShowMessages(false)}>
                    <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                        <MessagePopup onClose={() => setShowMessages(false)} />
                    </div>
                </div>
            )}

        </>
    );
};

export default Toolbar;
