import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../api/dashboardApi';
import { Terminal, Shield, RefreshCw, AlertCircle } from 'lucide-react';

const AgentConsole = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getDashboardData();
      setLogs(res.agentStatusLogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSimulateLogs = () => {
    // Generate diagnostic trace logs to show in case of disconnected API
    const mockDiagnostics = [
      { timestamp: new Date().toISOString(), agent: 'System', status: 'INFO', message: 'Diagnostics Check initiated.' },
      { timestamp: new Date().toISOString(), agent: 'DemandAgent', status: 'INFO', message: 'Loading regression forecasting model demand_forecasting.pkl' },
      { timestamp: new Date().toISOString(), agent: 'DemandAgent', status: 'SUCCESS', message: 'Forecast resolved at 134.40 units.' },
      { timestamp: new Date().toISOString(), agent: 'InventoryAgent', status: 'WARNING', message: 'Stockout risk detected! Current stock (35) below safety stock threshold (50).' },
      { timestamp: new Date().toISOString(), agent: 'CapacityAgent', status: 'INFO', message: 'Supplier lead time assessed at 6 days.' },
      { timestamp: new Date().toISOString(), agent: 'CostAgent', status: 'SUCCESS', message: 'Estimated project total cost compiled at $18,450.00' },
      { timestamp: new Date().toISOString(), agent: 'SLAAgent', status: 'SUCCESS', message: 'No latency detected. SLA penalty exposure: $0.00' },
      { timestamp: new Date().toISOString(), agent: 'NegotiationEngine', status: 'WARNING', message: 'Negotiating cost constraints vs safety limits...' },
      { timestamp: new Date().toISOString(), agent: 'NegotiationEngine', status: 'SUCCESS', message: 'Resolution Strategy set to Standard Plan.' },
      { timestamp: new Date().toISOString(), agent: 'PlannerAgent', status: 'SUCCESS', message: 'Master production scheduled for 99.4 units.' },
      { timestamp: new Date().toISOString(), agent: 'SimulationAgent', status: 'SUCCESS', message: 'Resiliency comparison scenarios evaluated. Normal plan remains optimal.' },
      { timestamp: new Date().toISOString(), agent: 'ExplainabilityAgent', status: 'SUCCESS', message: 'Natural language report compiled successfully.' },
    ];
    setLogs(mockDiagnostics);
  };

  const handleClear = () => {
    setLogs([]);
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={20} style={{ color: 'var(--primary)' }} />
            <h2 className="page-title">Agent Telemetry Console</h2>
          </div>
          <p className="page-subtitle">Real-time trace logs showing sequential communication across the agent network.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleClear}>Clear Console</button>
          <button className="btn btn-secondary" onClick={handleSimulateLogs}>Run Diagnostic Diagnostics</button>
          <button className="btn btn-primary" onClick={fetchLogs} disabled={loading}>
            <RefreshCw size={14} style={{ marginRight: '6px' }} className={loading ? 'spin-icon' : ''} />
            Fetch Telemetry
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-muted)' }}>
          <Shield size={16} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Audit Stream Active
          </span>
        </div>

        <div className="log-stream">
          {logs.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              <AlertCircle size={32} style={{ marginBottom: '12px' }} />
              <p>Terminal empty. Fetch telemetry or run recommendation to stream events.</p>
            </div>
          ) : (
            logs.map((log, idx) => {
              let logColor = '#38bdf8'; // Info/standard
              if (log.status === 'SUCCESS') logColor = '#10b981'; // Green
              else if (log.status === 'WARNING') logColor = '#f59e0b'; // Orange/Yellow
              else if (log.status === 'ERROR') logColor = '#ef4444'; // Red

              return (
                <div key={idx} className="log-line" style={{ borderLeftColor: logColor }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>
                    [{log.timestamp?.substring(11, 19) || new Date().toLocaleTimeString()}]
                  </span>
                  <span style={{ color: logColor, fontWeight: 700, marginRight: '8px' }}>
                    [{log.agent || 'SYSTEM'}]
                  </span>
                  <span style={{ color: '#93c5fd', fontWeight: 500, marginRight: '8px' }}>
                    {log.status}:
                  </span>
                  <span style={{ color: '#f3f4f6' }}>
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentConsole;
