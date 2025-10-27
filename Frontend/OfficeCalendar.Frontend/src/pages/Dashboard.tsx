import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Navigate to different pages:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '10px' }}>
          <Link to="/weekplanner">Week Planner</Link>
        </li>
        <li style={{ marginBottom: '10px' }}>
          <Link to="/contact">Contact</Link>
        </li>
        <li style={{ marginBottom: '10px' }}>
          <Link to="/faq">FAQ</Link>
        </li>
        <li style={{ marginBottom: '10px' }}>
          <Link to="/event">Event Page</Link>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;