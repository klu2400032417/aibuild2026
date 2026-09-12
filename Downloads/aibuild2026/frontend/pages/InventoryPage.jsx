import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getInventory, createInventory, updateInventory, deleteInventory 
} from '../api/inventoryApi';
import { generateRecommendation } from '../api/recommendationApi';
import InventoryTable from '../components/Inventory/InventoryTable';
import { Plus, X, Sparkles, CheckCircle } from 'lucide-react';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    productName: '', sku: '', location: 'Mumbai Store', currentStock: 50, safetyStock: 25, 
    leadTimeDays: 7, unitCost: 20.0, holdingCost: 2.5, maxCapacity: 200
  });

  // AI Orchestration loading state
  const [aiRunning, setAiRunning] = useState(false);
  const [currentRunningProduct, setCurrentRunningProduct] = useState('');

  const navigate = useNavigate();

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setInventory(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load inventory files from Spring Boot services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setForm({
      productName: '', sku: '', location: 'Mumbai Store', currentStock: 50, safetyStock: 25, 
      leadTimeDays: 7, unitCost: 20.0, holdingCost: 2.5, maxCapacity: 200
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setForm({
      productName: item.productName,
      sku: item.sku,
      location: item.location || 'Mumbai Store',
      currentStock: item.currentStock,
      safetyStock: item.safetyStock,
      leadTimeDays: item.leadTimeDays,
      unitCost: item.unitCost,
      holdingCost: item.holdingCost,
      maxCapacity: item.maxCapacity
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'productName' || name === 'sku' || name === 'location' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateInventory(editItem.id, form);
      } else {
        await createInventory(form);
      }
      loadInventory();
      handleCloseModal();
    } catch (err) {
      alert('Save operation failed. Please verify fields.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product node from the catalog?')) {
      try {
        await deleteInventory(id);
        loadInventory();
      } catch (err) {
        alert('Delete operation failed.');
      }
    }
  };

  const handleRunAI = async (item) => {
    try {
      setAiRunning(true);
      setCurrentRunningProduct(item.productName);
      
      // Simulate/trigger Agent negotiation endpoint
      const payload = {
        productId: item.id,
        historicalSales: item.currentStock * 2.2, // Simple forecast starting seed
        seasonIndex: 2,
        price: item.unitCost * 1.5,
        promoActive: 1
      };
      
      const recommendationResult = await generateRecommendation(payload);
      
      // Navigate to Recommendation view with the newly resolved recommendation
      navigate('/recommendation', { state: { recommendation: recommendationResult } });
    } catch (err) {
      console.error(err);
      alert('AI Execution failed. Fallback simulation could not complete.');
    } finally {
      setAiRunning(false);
      setCurrentRunningProduct('');
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Inventory Control</h2>
          <p className="page-subtitle">Manage supply nodes, safety stock limits, and execute multi-agent forecasting.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Add Catalog Node
        </button>
      </div>

      {error && (
        <div className="glass-card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* AI Orchestration Loader overlay */}
      {aiRunning && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(10, 14, 26, 0.95)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
          <Sparkles size={48} className="spin-icon" style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h3>Orchestrating Autonomous Supply Agents...</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Negotiating optimization parameters for <strong>{currentRunningProduct}</strong>
          </p>
          <div className="spinner" style={{ marginTop: '24px' }}></div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <InventoryTable 
          inventory={inventory} 
          onRunAgent={handleRunAI} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
        />
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="glass-card" style={{ width: '500px', position: 'relative', background: 'var(--bg-secondary)' }}>
            <button 
              onClick={handleCloseModal} 
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
              {editItem ? `Edit Node: ${editItem.productName}` : 'Add Catalog Node'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input 
                    name="productName" value={form.productName} onChange={handleChange}
                    className="form-control" placeholder="e.g. Server Rack" required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SKU Code</label>
                  <input 
                    name="sku" value={form.sku} onChange={handleChange}
                    className="form-control" placeholder="SKU-XXXX" required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <select 
                    name="location" value={form.location} onChange={handleChange}
                    className="form-control" required
                  >
                    <option value="Central Warehouse">Central Warehouse</option>
                    <option value="Mumbai Store">Mumbai Store</option>
                    <option value="Delhi Store">Delhi Store</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Current Stock</label>
                  <input 
                    name="currentStock" type="number" value={form.currentStock} onChange={handleChange}
                    className="form-control" min="0" required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Safety Stock</label>
                  <input 
                    name="safetyStock" type="number" value={form.safetyStock} onChange={handleChange}
                    className="form-control" min="1" required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Supplier Lead Time (Days)</label>
                  <input 
                    name="leadTimeDays" type="number" value={form.leadTimeDays} onChange={handleChange}
                    className="form-control" min="1" required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Cost ($)</label>
                  <input 
                    name="unitCost" type="number" step="0.01" value={form.unitCost} onChange={handleChange}
                    className="form-control" min="0.01" required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Holding Cost ($)</label>
                  <input 
                    name="holdingCost" type="number" step="0.01" value={form.holdingCost} onChange={handleChange}
                    className="form-control" min="0.1" required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Daily Capacity</label>
                  <input 
                    name="maxCapacity" type="number" value={form.maxCapacity} onChange={handleChange}
                    className="form-control" min="10" required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Node Parameters</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
