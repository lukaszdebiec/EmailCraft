import React, { useState } from 'react';
import { X, Plus, Trash2, Database, Search } from 'lucide-react';
import { useDynamicKeys } from '../contexts/DynamicKeyContext.tsx';

interface DynamicKeyManagerProps {
  onClose: () => void;
}

export const DynamicKeyManager: React.FC<DynamicKeyManagerProps> = ({ onClose }) => {
  const { dynamicKeys, addDynamicKey, deleteDynamicKey } = useDynamicKeys();
  const [newKey, setNewKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKeys = dynamicKeys.filter(key => 
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKey && !dynamicKeys.includes(newKey)) {
      addDynamicKey(newKey);
      setNewKey('');
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={20} color="#10b981" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>Dynamic Keys</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Manage system placeholders</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Search & Add */}
        <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <form onSubmit={handleAddKey} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="New key name (e.g. user-id)..." 
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="input-field"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 16px' }}>
              <Plus size={18} />
              <span>Add</span>
            </button>
          </form>
          
          <div style={{ marginTop: '12px', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Filter keys..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px', height: '36px', fontSize: '0.8125rem' }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 24px' }}>
          {filteredKeys.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredKeys.map(key => (
                <div key={key} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <code style={{ color: '#10b981', fontSize: '0.875rem' }}>{key}</code>
                  <button 
                    onClick={() => deleteDynamicKey(key)}
                    className="close-btn"
                    style={{ color: '#ef4444', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <p>No keys found.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};
