import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Boxes, 
  Sparkles, 
  TrendingUp, 
  Terminal, 
  Activity 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Boxes size={20} /> },
    { name: 'AI Recommendation', path: '/recommendation', icon: <Sparkles size={20} /> },
    { name: 'Simulations', path: '/simulation', icon: <Activity size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <TrendingUp size={20} /> },
    { name: 'Agent Console', path: '/console', icon: <Terminal size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">IQ</div>
        <span className="brand-name">Network<span>IQ</span></span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => (
          <NavLink 
            key={idx} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <span className="link-icon">{item.icon}</span>
            <span className="link-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-pulse"></div>
        <span className="system-status">Engine Online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
