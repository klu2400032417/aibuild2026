import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import RecommendationPage from './pages/RecommendationPage';
import SimulationPage from './pages/SimulationPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AgentConsole from './pages/AgentConsole';

import './src/index.css';

function App() {
  const handleRefreshAll = () => {
    window.location.reload();
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <Navbar onRefresh={handleRefreshAll} />
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/recommendation" element={<RecommendationPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/console" element={<AgentConsole />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
