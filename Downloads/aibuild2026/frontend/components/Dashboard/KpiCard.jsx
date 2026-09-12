import React from 'react';
import './KpiCard.css';

const KpiCard = ({ title, value, icon, description, status = 'primary' }) => {
  return (
    <div className={`kpi-card status-${status}`}>
      <div className="kpi-card-main">
        <div className="kpi-card-info">
          <span className="kpi-title">{title}</span>
          <span className="kpi-value">{value}</span>
        </div>
        <div className="kpi-icon-wrap">{icon}</div>
      </div>
      {description && <div className="kpi-description">{description}</div>}
    </div>
  );
};

export default KpiCard;
