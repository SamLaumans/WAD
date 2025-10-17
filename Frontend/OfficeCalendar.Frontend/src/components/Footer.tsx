import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        padding: '20px',
        backgroundColor: '#2b2b2b',
        textAlign: 'center',
        height: '25px',
        position: 'fixed',
        bottom: '0',
        width: '100%',
      }}
    >
      <Link to="/contact" style={{ margin: '0 10px' }}>
        Contact
      </Link>
      <Link to="/faq" style={{ margin: '0 10px' }}>
        FAQ
      </Link>
    </footer>
  );
};

export default Footer;