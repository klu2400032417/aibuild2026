import React from 'react';
import SupplyDemandChart from '../components/Charts/SupplyDemandChart';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

const AnalyticsPage = () => {
  // Advanced simulation dataset
  const data = [
    { period: 'Q1-W1', historical: 80, forecast: 90 },
    { period: 'Q1-W2', historical: 95, forecast: 110 },
    { period: 'Q1-W3', historical: 120, forecast: 115 },
    { period: 'Q1-W4', historical: 110, forecast: 125 },
    { period: 'Q2-W1', historical: 130, forecast: 140 },
    { period: 'Q2-W2', historical: 160, forecast: 155 },
    { period: 'Q2-W3', historical: 145, forecast: 165 },
    { period: 'Q2-W4', historical: 175, forecast: 185 },
  ];

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
            <h2 className="page-title">Advanced Supply Chain Analytics</h2>
          </div>
          <p className="page-subtitle">Inspect historical throughput patterns, optimized planning volumes, and forecasts.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: '24px' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            <h4>Supply Plan vs Demand Forecast</h4>
          </div>
          <SupplyDemandChart data={data} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card">
            <h4 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Planning Quality Index</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span>Forecast Accuracy</span>
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>96.4%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                  <div style={{ width: '96.4%', height: '100%', background: 'var(--success)', borderRadius: '3px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span>Capacity Utilization</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>78.2%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                  <div style={{ width: '78.2%', height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span>SLA Adherence</span>
                  <span style={{ fontWeight: 600, color: 'var(--warning)' }}>89.5%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                  <div style={{ width: '89.5%', height: '100%', background: 'var(--warning)', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <PieChart size={18} style={{ color: 'var(--accent)' }} />
              <h5 style={{ fontFamily: 'var(--font-display)' }}>Cost Distribution</h5>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fulfillment Procurement:</span>
                <span style={{ fontWeight: 600 }}>75%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Holding Charges:</span>
                <span style={{ fontWeight: 600 }}>15%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Logistics & Cargo:</span>
                <span style={{ fontWeight: 600 }}>10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
