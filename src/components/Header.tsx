import React from 'react';
import { Eye, Edit3, Download, Send, RotateCcw, Save, FileText } from 'lucide-react';

interface HeaderProps {
  viewMode: 'edit' | 'preview';
  setViewMode: (mode: 'edit' | 'preview') => void;
  onExport: () => void;
  onReset: () => void;
  savedTemplates: string[];
  onSaveTemplate: (name: string) => void;
  onLoadTemplate: (name: string) => void;
  currentTemplateName: string | null;
}

export const Header: React.FC<HeaderProps> = ({ 
  viewMode, 
  setViewMode, 
  onExport, 
  onReset,
  savedTemplates,
  onSaveTemplate,
  onLoadTemplate,
  currentTemplateName
}) => {
  const handleSave = () => {
    const name = window.prompt('Enter template name:', currentTemplateName || '');
    if (name) {
      onSaveTemplate(name);
    }
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <div className="logo-icon">
          <Send size={18} color="white" />
        </div>
        <span className="logo-text">Email<span style={{ color: 'var(--accent-color)' }}>Craft</span></span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="view-controls">
          <button 
            className={`view-button ${viewMode === 'edit' ? 'active' : ''}`}
            onClick={() => setViewMode('edit')}
          >
            <Edit3 size={16} />
            <span>Edit</span>
          </button>
          <button 
            className={`view-button ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
        </div>

        <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <FileText size={16} style={{ position: 'absolute', left: '10px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <select 
              value={currentTemplateName || ''}
              onChange={(e) => e.target.value && onLoadTemplate(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white',
                padding: '6px 12px 6px 32px',
                fontSize: '0.8125rem',
                outline: 'none',
                minWidth: '160px',
                cursor: 'pointer'
              }}
            >
              <option value="">Select Template...</option>
              {savedTemplates.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <button 
            className="export-button" 
            onClick={handleSave}
            title="Save Template"
            style={{ padding: '8px 12px' }}
          >
            <Save size={16} />
          </button>
        </div>
      </div>

      <div className="header-actions" style={{ display: 'flex', gap: '8px' }}>
        <button className="reset-button" onClick={onReset}>
          <RotateCcw size={16} />
          <span>Start Over</span>
        </button>
        <button className="export-button" onClick={onExport}>
          <Download size={16} />
          <span>Export HTML</span>
        </button>
      </div>
    </header>
  );
};
