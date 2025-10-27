import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Toolbar.css';

const Toolbar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="toolbar">
            <Link to="/main-page" className={location.pathname === '/main-page' ? 'active' : ''}>Home</Link>
            <Link to="/weekplanner" className={location.pathname === '/weekplanner' ? 'active' : ''}>Agenda</Link>
            <Link to="/create-event" className={location.pathname === '/create-event' ? 'active' : ''}>Create Event</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
            <Link to="/logout" className={location.pathname === '/logout' ? 'active' : ''}>Logout</Link>
        </div>
    );
};

export default Toolbar;
