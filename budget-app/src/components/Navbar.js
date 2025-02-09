import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="bottom-navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
