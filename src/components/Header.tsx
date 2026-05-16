import React from 'react';
import { Eye, Edit3, Download, Send, RotateCcw, Save, FileText, ChevronDown } from 'lucide-react';

interface HeaderProps {
  viewMode: 'edit' | 'preview';
  setViewMode: (mode: 'edit' | 'preview') => void;
  onExport: () => void;
  onReset: () => void;
  savedTemplates: string[];
  onOpenSaveModal: () => void;
  onLoadTemplate: (name: string) => void;
  currentTemplateName: string | null;
}

export const Header: React.FC<HeaderProps> = ({ 
  viewMode, 
  setViewMode, 
  onExport, 
  onReset,
  savedTemplates,
  onOpenSaveModal,
  onLoadTemplate,
  currentTemplateName
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="custom-dropdown" ref={dropdownRef}>
            <button 
              className="dropdown-trigger" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FileText size={16} style={{ position: 'absolute', left: '10px', color: 'var(--text-secondary)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                {currentTemplateName || 'Select Template...'}
              </span>
              <ChevronDown size={14} style={{ opacity: 0.5 }} />
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {savedTemplates.length === 0 ? (
                  <div className="dropdown-empty">No saved templates</div>
                ) : (
                  savedTemplates.map(name => (
                    <button 
                      key={name}
                      className={`dropdown-item ${currentTemplateName === name ? 'active' : ''}`}
                      onClick={() => {
                        onLoadTemplate(name);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          
          <button 
            className="export-button" 
            onClick={onOpenSaveModal}
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
