import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, Cpu } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onRefresh }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Cpu className="navbar-logo-icon" size={24} />
        <div>
          <h3>System Orchestration Center</h3>
          <p className="navbar-subtext">Multi-Agent Planning & Negotiation Network</p>
        </div>
      </div>

      <div className="navbar-right">
        <span className="navbar-time">{time.toLocaleTimeString()}</span>
        <button className="navbar-btn-icon" onClick={onRefresh} title="Refresh System Status">
          <RefreshCw size={18} />
        </button>
        <button className="navbar-btn-icon" title="Notifications">
          <Bell size={18} />
          <span className="btn-badge"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">SA</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
