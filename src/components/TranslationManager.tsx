import React, { useState } from 'react';
import { X, Plus, Trash2, Globe, Search } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { LANGUAGES } from '../utils/translations.ts';

interface TranslationManagerProps {
  onClose: () => void;
}

export const TranslationManager: React.FC<TranslationManagerProps> = ({ onClose }) => {
  const { translations, updateTranslation, addTranslationKey, deleteTranslationKey } = useTranslation();
  const [newKey, setNewKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all unique keys from the default language (English)
  const allKeys = Object.keys(translations.english).filter(key => 
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKey && !translations.english[newKey]) {
      addTranslationKey(newKey);
      setNewKey('');
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={{ maxWidth: '95%', width: '1600px', maxHeight: '90vh' }}>
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={22} color="var(--accent-color)" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Translation Manager</h2>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Manage keys and multi-language content</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} title="Close Manager">
            <X size={20} />
          </button>
        </div>

        {/* Search & Add Bar */}
        <div style={{ padding: '20px 32px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search keys..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '44px' }}
            />
          </div>
          
          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          <form onSubmit={handleAddKey} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="New key name..." 
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="input-field"
                style={{ width: '240px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', height: '42px' }}>
              <Plus size={18} />
              <span>Add Key</span>
            </button>
          </form>
        </div>

        {/* Table Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 32px' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', color: 'white' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#111114', zIndex: 10 }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.06)', width: '180px' }}>Key Name</th>
                {LANGUAGES.map(lang => (
                  <th key={lang.id} style={{ textAlign: 'left', padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {lang.label}
                  </th>
                ))}
                <th style={{ width: '60px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}></th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.875rem' }}>
              {allKeys.map(key => (
                <tr key={key} style={{ transition: 'background 0.2s' }}>
                  <td style={{ padding: '12px', verticalAlign: 'top' }}>
                    <div style={{ 
                      background: 'rgba(99, 102, 241, 0.08)', 
                      color: '#a5b4fc', 
                      padding: '6px 10px', 
                      borderRadius: '8px', 
                      fontSize: '0.8125rem',
                      fontFamily: 'monospace',
                      display: 'inline-block',
                      border: '1px solid rgba(99, 102, 241, 0.15)'
                    }}>
                      {key}
                    </div>
                  </td>
                  {LANGUAGES.map(lang => (
                    <td key={lang.id} style={{ padding: '8px 12px' }}>
                      <textarea
                        value={translations[lang.id][key] || ''}
                        onChange={(e) => updateTranslation(lang.id, key, e.target.value)}
                        placeholder={`Value for ${lang.label}...`}
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          color: 'white',
                          padding: '12px',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                          resize: 'vertical',
                          outline: 'none',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = 'var(--accent-color)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        }}
                      />
                    </td>
                  ))}
                  <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                    <button 
                      onClick={() => deleteTranslationKey(key)}
                      className="close-btn"
                      style={{ color: '#ef4444' }}
                      title="Delete Key"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allKeys.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 40px', color: '#64748b' }}>
              <div style={{ marginBottom: '12px' }}>
                <Search size={40} opacity={0.2} />
              </div>
              <p style={{ margin: 0, fontSize: '0.9375rem' }}>No translation keys found matching your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(255,255,255,0.01)' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ minWidth: '120px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
