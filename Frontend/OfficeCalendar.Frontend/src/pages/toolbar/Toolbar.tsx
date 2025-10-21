import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Toolbar.css';

const Header: React.FC = () => {
    const location = useLocation();

    return (
        <div className="toolbar">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/agenda" className={location.pathname === '/agenda' ? 'active' : ''}>Agenda</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        </div>
    );
};

export default Header;
