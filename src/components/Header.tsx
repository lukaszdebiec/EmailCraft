import React from 'react';
import { Eye, Edit3, Download, Send, RotateCcw } from 'lucide-react';

interface HeaderProps {
  viewMode: 'edit' | 'preview';
  setViewMode: (mode: 'edit' | 'preview') => void;
  onExport: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode, onExport, onReset }) => {
  return (
    <header className="app-header">
      <div className="header-logo">
        <div className="logo-icon">
          <Send size={18} color="white" />
        </div>
        <span className="logo-text">Email<span style={{ color: 'var(--accent-color)' }}>Craft</span></span>
      </div>
      
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
