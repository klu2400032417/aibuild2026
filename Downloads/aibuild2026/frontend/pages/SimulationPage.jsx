import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SimulationResult from '../components/Simulation/SimulationResult';
import { Activity, ShieldAlert, Sparkles } from 'lucide-react';

const SimulationPage = () => {
  const location = useLocation();
  
  // Scenarios passed from recommendation
  const passedScenarios = location.state?.scenarios || [];
  const passedBest = location.state?.bestScenario || '';

  // Sliders for dynamic hypothetical adjustment
  const [demandModifier, setDemandModifier] = useState(0);
  const [capacityModifier, setCapacityModifier] = useState(0);

  // Generate dynamic modified simulation outputs based on slider values
  const getModifiedScenarios = () => {
    if (passedScenarios.length === 0) return [];
    
    return passedScenarios.map(sc => {
      let costMult = 1.0;
      let slaSub = 0;
      let risk = sc.stockoutRisk;

      if (demandModifier > 0) {
        costMult += (demandModifier / 100) * 0.5;
        slaSub += (demandModifier / 10) * 2;
      }
      if (capacityModifier < 0) {
        costMult += Math.abs(capacityModifier / 100) * 0.8;
        slaSub += Math.abs(capacityModifier / 10) * 4;
        risk = 'High';
      }

      const finalCost = sc.cost * costMult;
      const finalSla = Math.max(30, sc.slaScore - slaSub);
      
      return {
        ...sc,
        cost: round(finalCost),
        slaScore: round(finalSla),
        stockoutRisk: risk,
        score: round(Math.max(10, sc.score - (slaSub * 0.5)))
      };
    });
  };

  const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  const activeScenarios = passedScenarios.length > 0 ? getModifiedScenarios() : [];

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} style={{ color: 'var(--primary)' }} />
            <h2 className="page-title">Stress-Test Scenario Simulator</h2>
          </div>
          <p className="page-subtitle">Evaluate how plans perform under capacity constraints and demand spikes.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: passedScenarios.length > 0 ? '1fr 3fr' : '1fr', gap: '24px' }}>
        {passedScenarios.length > 0 && (
          <div className="glass-card" style={{ height: 'fit-content' }}>
            <h4 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Tweak Stressors</h4>
            
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Demand Surge:</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>+{demandModifier}%</span>
              </label>
              <input 
                type="range" min="0" max="100" value={demandModifier} 
                onChange={(e) => setDemandModifier(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulates holiday spikes or promo shocks</span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Supplier Cutback:</span>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{capacityModifier}%</span>
              </label>
              <input 
                type="range" min="-80" max="0" value={capacityModifier} 
                onChange={(e) => setCapacityModifier(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--danger)' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulates factory shut-downs or customs delay</span>
            </div>
          </div>
        )}

        <div>
          <SimulationResult scenarios={activeScenarios} bestScenario={passedBest} />
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
