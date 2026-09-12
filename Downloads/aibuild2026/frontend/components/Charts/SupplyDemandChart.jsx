import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';

const SupplyDemandChart = ({ data = [] }) => {
  // Fallback demo data if none is provided
  const demoData = [
    { period: 'Jan', historical: 100, forecast: 105, capacity: 150 },
    { period: 'Feb', historical: 150, forecast: 155, capacity: 150 },
    { period: 'Mar', historical: 120, forecast: 125, capacity: 150 },
    { period: 'Apr', historical: 180, forecast: 185, capacity: 200 },
    { period: 'May', historical: 110, forecast: 112, capacity: 200 },
    { period: 'Jun', historical: 160, forecast: 163, capacity: 200 },
  ];

  const chartData = data.length > 0 ? data : demoData;

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
            </linearGradient>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#d946ef" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="period" 
            stroke="#9ca3af" 
            tickLine={false}
            style={{ fontSize: '0.8rem', fontFamily: 'Inter' }}
          />
          <YAxis 
            stroke="#9ca3af" 
            tickLine={false}
            style={{ fontSize: '0.8rem', fontFamily: 'Inter' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111827', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#f3f4f6'
            }} 
          />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '0.85rem' }} />
          <Area 
            type="monotone" 
            name="Historical Sales"
            dataKey="historical" 
            stroke="#6366f1" 
            fillOpacity={1} 
            fill="url(#colorHist)" 
          />
          <Area 
            type="monotone" 
            name="Optimized Forecast"
            dataKey="forecast" 
            stroke="#d946ef" 
            fillOpacity={1} 
            fill="url(#colorForecast)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SupplyDemandChart;
