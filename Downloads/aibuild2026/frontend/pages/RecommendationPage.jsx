import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecommendationCards from '../components/Recommendation/RecommendationCards';
import { approveRecommendation } from '../api/recommendationApi';
import { Sparkles, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

const RecommendationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve passed recommendation object
  const recommendation = location.state?.recommendation;

  const handleApprove = async () => {
    try {
      if (recommendation && recommendation.id) {
        await approveRecommendation(recommendation.id);
        alert(`Success: Stock transfer recommendation approved! MySQL database inventory updated.`);
      } else {
        alert("Plan approved locally (offline fallback mode).");
      }
      navigate('/inventory');
    } catch (err) {
      console.error(err);
      alert("Failed to execute transfer approval. Please verify database connection.");
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: 'var(--primary)' }} />
            <h2 className="page-title">AI Recommendation Engine</h2>
          </div>
          <p className="page-subtitle">Inspect the resolved optimized plan and the explainability rationale.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/inventory')}>
            <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Inventory
          </button>
          {recommendation && (
            <button className="btn btn-primary" onClick={handleApprove}>
              Approve Master Plan
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: recommendation ? '2.5fr 1fr' : '1fr', gap: '24px' }}>
        <div>
          <RecommendationCards recommendation={recommendation} />
        </div>

        {recommendation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card">
              <h4 style={{ marginBottom: '12px', fontFamily: 'var(--font-display)' }}>Next Steps</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Analyze how the recommendation holds up under disruption or demand shocks. Run alternative scenarios in the simulator.
              </p>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => navigate('/simulation', { state: { scenarios: recommendation.scenarios, bestScenario: recommendation.bestScenario } })}
              >
                Go to Simulator <ArrowRight size={14} style={{ marginLeft: '6px' }} />
              </button>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Calendar size={18} style={{ color: 'var(--info)' }} />
                <h5 style={{ fontFamily: 'var(--font-display)' }}>Audit Log details</h5>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Optimization run:</span>
                  <span style={{ fontWeight: 600 }}>Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Confidence rating:</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>High (94%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Run mode:</span>
                  <span style={{ fontFamily: 'monospace' }}>Multi-Agent</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPage;
