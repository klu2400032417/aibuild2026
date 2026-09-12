import React from 'react';
import { Play, Trash2, Edit3, AlertTriangle } from 'lucide-react';

const InventoryTable = ({ inventory = [], onRunAgent, onEdit, onDelete }) => {
  return (
    <div className="table-container glass-card" style={{ padding: 0 }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Product Details</th>
            <th>SKU</th>
            <th>Location</th>
            <th>Stock Status</th>
            <th>Supplier Lead Time</th>
            <th>Unit Cost</th>
            <th>Max Daily Capacity</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No inventory records found. Add item or start database.
              </td>
            </tr>
          ) : (
            inventory.map((item) => {
              const isLowStock = item.currentStock < item.safetyStock;
              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {item.id}</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.sku}</td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.location || 'Warehouse'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{item.currentStock} / {item.safetyStock} min</span>
                      {isLowStock ? (
                        <span className="badge badge-danger" title="Below Safety Stock Level!">
                          <AlertTriangle size={12} style={{ marginRight: '4px' }} /> Low Stock
                        </span>
                      ) : (
                        <span className="badge badge-success">Sufficient</span>
                      )}
                    </div>
                  </td>
                  <td>{item.leadTimeDays} days</td>
                  <td>${item.unitCost?.toFixed(2)}</td>
                  <td>{item.maxCapacity} units</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => onRunAgent(item)}
                        title="Execute Multi-Agent Optimization Pipeline"
                      >
                        <Play size={12} style={{ marginRight: '6px' }} /> Run AI
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px', minWidth: 'auto' }}
                        onClick={() => onEdit(item)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px', minWidth: 'auto', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
