import React from 'react';
import { ShieldAlert, AlertCircle, HelpCircle } from 'lucide-react';
import './SimulationResult.css';

const SimulationResult = ({ scenarios = [], bestScenario = '' }) => {
  if (scenarios.length === 0) {
    return (
      <div className="glass-card simulation-empty">
        <HelpCircle size={36} className="empty-icon animate-pulse" />
        <h5>No Simulation Runs Loaded</h5>
        <p>Trigger a recommendation in the Inventory page first to populate alternative planning scenario simulations.</p>
      </div>
    );
  }

  return (
    <div className="simulation-results-wrapper">
      <div className="simulation-scenarios-grid">
        {scenarios.map((sc, idx) => {
          const isBest = sc.scenarioName === bestScenario;
          let riskClass = 'risk-low';
          if (sc.stockoutRisk === 'High') riskClass = 'risk-high';
          else if (sc.stockoutRisk === 'Medium') riskClass = 'risk-medium';

          return (
            <div key={idx} className={`scenario-card glass-card ${isBest ? 'best-scenario-glow' : ''}`}>
              {isBest && (
                <div className="best-badge">
                  <ShieldAlert size={12} />
                  <span>Highest Resiliency</span>
                </div>
              )}
              <h4 className="scenario-name">{sc.scenarioName}</h4>
              
              <div className="scenario-metrics">
                <div className="sc-metric">
                  <span className="sc-m-title">Demand Target</span>
                  <span className="sc-m-val">{sc.demand} units</span>
                </div>
                <div className="sc-metric">
                  <span className="sc-m-title">Projected Cost</span>
                  <span className="sc-m-val">${sc.cost?.toLocaleString()}</span>
                </div>
                <div className="sc-metric">
                  <span className="sc-m-title">SLA Compliance</span>
                  <span className="sc-m-val">{sc.slaScore}%</span>
                </div>
                <div className="sc-metric">
                  <span className="sc-m-title">Stockout Risk</span>
                  <span className={`sc-m-val badge ${riskClass}`}>{sc.stockoutRisk}</span>
                </div>
              </div>

              <div className="scenario-footer">
                <div className="scenario-score-wrap">
                  <span className="score-label">Resiliency Score</span>
                  <span className="score-val">{sc.score}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimulationResult;
