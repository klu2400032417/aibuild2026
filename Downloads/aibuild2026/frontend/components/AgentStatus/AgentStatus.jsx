import React from 'react';
import { 
  Users, CheckCircle2, AlertTriangle, Play, HelpCircle
} from 'lucide-react';
import './AgentStatus.css';

const AgentStatus = ({ logs = [] }) => {
  const agents = [
    { key: 'DemandAgent', name: 'Demand Forecaster' },
    { key: 'InventoryAgent', name: 'Inventory Optimizer' },
    { key: 'CapacityAgent', name: 'Capacity Assessor' },
    { key: 'CostAgent', name: 'Cost Projection Engine' },
    { key: 'SLAAgent', name: 'SLA Risk Evaluator' },
    { key: 'NegotiationEngine', name: 'Negotiation Arbiter' },
    { key: 'PlannerAgent', name: 'Master Planner' },
    { key: 'SimulationAgent', name: 'Scenario Simulator' },
    { key: 'ExplainabilityAgent', name: 'Explainability Writer' }
  ];

  // Helper to determine agent status from current log trace
  const getAgentStatus = (agentKey) => {
    const agentLogs = logs.filter(l => l.agent === agentKey);
    if (agentLogs.length === 0) return { state: 'IDLE', message: 'Awaiting execution run...' };

    const lastLog = agentLogs[agentLogs.length - 1];
    return {
      state: lastLog.status === 'ERROR' ? 'FAILED' : lastLog.status === 'SUCCESS' ? 'COMPLETED' : 'PROCESSING',
      message: lastLog.message
    };
  };

  return (
    <div className="agent-status-section">
      <div className="section-title-wrap">
        <Users size={18} className="title-icon" />
        <h4>Multi-Agent Status Network</h4>
      </div>
      
      <div className="agent-grid">
        {agents.map((agent, idx) => {
          const status = getAgentStatus(agent.key);
          let statusClass = 'status-idle';
          let icon = <HelpCircle size={16} />;

          if (status.state === 'COMPLETED') {
            statusClass = 'status-completed';
            icon = <CheckCircle2 size={16} />;
          } else if (status.state === 'PROCESSING') {
            statusClass = 'status-processing';
            icon = <Play size={16} className="spin-icon" />;
          } else if (status.state === 'FAILED') {
            statusClass = 'status-failed';
            icon = <AlertTriangle size={16} />;
          }

          return (
            <div key={idx} className={`agent-status-card ${statusClass}`}>
              <div className="agent-card-header">
                <span className="agent-name">{agent.name}</span>
                <span className="agent-badge">{status.state}</span>
              </div>
              <div className="agent-card-body">
                <span className="status-icon">{icon}</span>
                <p className="agent-msg">{status.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentStatus;
