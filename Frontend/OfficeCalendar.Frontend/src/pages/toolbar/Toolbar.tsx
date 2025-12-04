import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Profiel from '../profile-page/profiel';
import './Toolbar.css';
import img1 from '../../assets/janjanssen.jpg';

const Toolbar: React.FC = () => {
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);

    return (
        <>
            <div className="toolbar">

                {/* Your existing links */}
                <Link to="/main-page" className={location.pathname === '/main-page' ? 'active' : ''}>Home</Link>
                <Link to="/weekplanner" className={location.pathname === '/weekplanner' ? 'active' : ''}>Week Planner</Link>
                <Link to="/monthdayview" className={location.pathname === '/monthdayview' ? 'active' : ''}>Maand Planner</Link>
                <Link to="/create-event" className={location.pathname === '/create-event' ? 'active' : ''}>Create Event</Link>
                <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
                <Link to="/logout" className={location.pathname === '/logout' ? 'active' : ''}>Logout</Link>

                <img  //profiel foto
                    src={img1} 
                    alt="profile" 
                    className="toolbar-profile-pic"
                    onClick={() => setShowProfile(true)}
                />
            </div>

            {showProfile && ( //popup
                <div className="profile-modal-overlay">
                    <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowProfile(false)}>×</button>
                        <Profiel />
                    </div>
                </div>
            )}
        </>
    );
};

export default Toolbar;
