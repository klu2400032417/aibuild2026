import React from 'react';
import { 
  Sparkles, DollarSign, ShieldAlert, Navigation, FileText, CheckCircle 
} from 'lucide-react';
import './RecommendationCards.css';

const RecommendationCards = ({ recommendation }) => {
  if (!recommendation) {
    return (
      <div className="glass-card recommendation-empty">
        <Sparkles size={36} className="empty-icon animate-pulse" />
        <h5>Ready to Optimize Planning</h5>
        <p>Go to the Inventory page and click <strong>Run AI</strong> to initiate the agent negotiation flow.</p>
      </div>
    );
  }

  const productName = recommendation.productName ?? recommendation.product_name;
  const demandForecast = recommendation.demandForecast ?? recommendation.demand_forecast;
  const recommendedReorder = recommendation.recommendedReorder ?? recommendation.recommended_reorder;
  const totalEstimatedCost = recommendation.totalEstimatedCost ?? recommendation.total_estimated_cost;
  const slaScore = recommendation.slaScore ?? recommendation.sla_score;
  const resolutionStrategy = recommendation.resolutionStrategy ?? recommendation.resolution_strategy;
  const distributionRoute = recommendation.distributionRoute ?? recommendation.distribution_route;
  const explanation = recommendation.explanation;

  return (
    <div className="recommendation-cards-wrapper">
      <div className="rec-top-card glass-card">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div className="strategy-banner">
            <Sparkles size={16} />
            <span>Active Strategy: {resolutionStrategy}</span>
          </div>
          {resolutionStrategy !== "COST_GUARDRAIL_BLOCKED" && resolutionStrategy !== "WAREHOUSE_SOURCE_HUB" && (
            <div className="strategy-banner" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle size={16} />
              <span>Cost Guardrail: PASSED</span>
            </div>
          )}
          {resolutionStrategy === "COST_GUARDRAIL_BLOCKED" && (
            <div className="strategy-banner" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <ShieldAlert size={16} />
              <span>Cost Guardrail: FAILED</span>
            </div>
          )}
        </div>
        
        <h3 style={{ marginTop: '16px' }}>
          {recommendation.location && recommendation.location.toLowerCase().includes("warehouse") ? (
            `Warehouse Node: ${productName} (Hub)`
          ) : (
            `Stock Transfer: Central Warehouse ➔ ${recommendation.location || 'Store'}`
          )}
        </h3>
        <p className="rec-subtitle">Fulfillment Network Rebalancing Plan ({productName})</p>
      </div>

      <div className="rec-metrics-grid">
        <div className="metric-card glass-card">
          <div className="m-icon-wrap bg-blue"><CheckCircle size={20} /></div>
          <div className="m-data">
            <span className="m-title">Target Reorder Qty</span>
            <span className="m-val">{recommendedReorder} units</span>
            <span className="m-sub">Forecast Demand: {demandForecast}</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="m-icon-wrap bg-green"><DollarSign size={20} /></div>
          <div className="m-data">
            <span className="m-title">Total Project Cost</span>
            <span className="m-val">${totalEstimatedCost?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            <span className="m-sub">Includes handling & transport</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="m-icon-wrap bg-purple"><ShieldAlert size={20} /></div>
          <div className="m-data">
            <span className="m-title">SLA Reliability Score</span>
            <span className="m-val">{slaScore}%</span>
            <span className="m-sub">Delivery threshold: 10 days</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="m-icon-wrap bg-cyan"><Navigation size={20} /></div>
          <div className="m-data">
            <span className="m-title">Distribution Logistics Route</span>
            <span className="m-val">{distributionRoute || 'Standard Cargo'}</span>
            <span className="m-sub">Negotiated via Cost/SLA agents</span>
          </div>
        </div>
      </div>

      <div className="rec-explanation-card glass-card">
        <div className="explanation-header">
          <FileText size={18} />
          <h4>Explainability Agent Rationale</h4>
        </div>
        <div className="explanation-body">
          {explanation ? (
            <div className="markdown-explanation">
              {explanation.split('\n').map((line, idx) => {
                if (line.startsWith('###')) {
                  return <h5 key={idx} style={{ marginTop: '16px', marginBottom: '8px', fontSize: '1rem', color: '#818cf8' }}>{line.replace('###', '').trim()}</h5>;
                } else if (line.startsWith('-')) {
                  return <li key={idx} style={{ marginLeft: '16px', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{line.replace('-', '').trim()}</li>;
                } else if (line.trim() !== '') {
                  return <p key={idx} style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{line}</p>;
                }
                return null;
              })}
            </div>
          ) : (
            <p>No explanation loaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCards;
