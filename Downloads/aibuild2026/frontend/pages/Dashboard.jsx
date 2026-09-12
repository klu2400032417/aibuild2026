import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../api/dashboardApi';
import KpiCard from '../components/Dashboard/KpiCard';
import AgentStatus from '../components/AgentStatus/AgentStatus';
import { 
  Boxes, DollarSign, Award, ShieldAlert, Sparkles, ArrowRight 
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardData();
      setData(res);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to Spring Boot backend APIs. Please verify that the services are online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="main-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" style={{ width: '48px', height: '48px' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Gathering supply chain metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', textAlign: 'center', borderColor: 'var(--danger)' }}>
          <ShieldAlert size={48} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
          <h3>Connection Failure</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '12px 0 20px 0' }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Executive Dashboard</h2>
          <p className="page-subtitle">Autonomous inventory optimization and multi-agent coordination status.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadData}>Refresh Metrics</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <KpiCard 
          title="Total Products Catalog" 
          value={data?.totalProducts || 0}
          icon={<Boxes size={22} />}
          description="Monitored supply chain nodes"
          status="primary"
        />
        <KpiCard 
          title="Fulfillment Budget" 
          value={`$${data?.totalCosts?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={<DollarSign size={22} />}
          description="Aggregate recommendation spend"
          status="success"
        />
        <KpiCard 
          title="SLA Compliance Score" 
          value={`${data?.averageSlaScore?.toFixed(1)}%`}
          icon={<Award size={22} />}
          description="Average delivery reliability"
          status="warning"
        />
        <KpiCard 
          title="Stockout Warning Alerts" 
          value={data?.stockoutAlerts || 0}
          icon={<ShieldAlert size={22} />}
          description="Products below safety limits"
          status={data?.stockoutAlerts > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Agent monitor grid */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <AgentStatus logs={data?.agentStatusLogs} />
      </div>

      {/* Recent Recommendations Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            <h4>Recent AI Recommendations</h4>
          </div>
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => navigate('/inventory')}>
            Optimize Inventory <ArrowRight size={12} style={{ marginLeft: '6px' }} />
          </button>
        </div>

        <div className="table-container" style={{ padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Demand Target</th>
                <th>Reorder Qty</th>
                <th>Est. Project Cost</th>
                <th>Fulfillment SLA</th>
                <th>Strategy Applied</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentRecommendations?.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                    No calculations run yet. Go to Inventory and click "Run AI".
                  </td>
                </tr>
              ) : (
                data?.recentRecommendations?.map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 600 }}>{rec.productName}</td>
                    <td>{rec.demandForecast} units</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{rec.recommendedReorder} units</td>
                    <td>${rec.totalEstimatedCost?.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td>
                      <span className={`badge ${rec.slaScore >= 80 ? 'badge-success' : 'badge-warning'}`}>
                        {rec.slaScore}%
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{rec.resolutionStrategy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
