import React from 'react';
import { Eye, Download, Send, RotateCcw, Save, FileText, ChevronDown } from 'lucide-react';

interface HeaderProps {
  setViewMode: (mode: 'edit' | 'preview') => void;
  onExport: () => void;
  onReset: () => void;
  savedTemplates: string[];
  onOpenSaveModal: () => void;
  onLoadTemplate: (name: string) => void;
  currentTemplateName: string | null;
}

export const Header: React.FC<HeaderProps> = ({ 
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
    <header className="app-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
      <div className="header-logo">
        <div className="logo-icon">
          <Send size={18} color="white" />
        </div>
        <span className="logo-text">Email<span style={{ color: 'var(--accent-color)' }}>Craft</span></span>
      </div>
      
      <div className="header-toolbar" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '6px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        justifySelf: 'center'
      }}>
        {/* View Mode Group */}
        <div className="view-controls" style={{ background: 'transparent', padding: 0 }}>
          <button 
            className="view-button"
            onClick={() => setViewMode('preview')}
            style={{ padding: '6px 12px' }}
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>
        </div>

        <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

        {/* Template Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="custom-dropdown" ref={dropdownRef}>
            <button 
              className="dropdown-trigger" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ padding: '6px 12px 6px 32px', height: '32px' }}
            >
              <FileText size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-secondary)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
                {currentTemplateName || 'Select Template...'}
              </span>
              <ChevronDown size={12} style={{ opacity: 0.5 }} />
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
            style={{ padding: '6px 12px', height: '32px', gap: '6px' }}
          >
            <Save size={14} />
            <span style={{ fontSize: '0.8125rem' }}>Save</span>
          </button>
        </div>

        <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

        {/* Global Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="reset-button" onClick={onReset} style={{ padding: '6px 12px', height: '32px', border: 'none' }}>
            <RotateCcw size={14} />
            <span style={{ fontSize: '0.8125rem' }}>Start Over</span>
          </button>
          <button className="export-button" onClick={onExport} style={{ 
            padding: '6px 12px', 
            height: '32px', 
            gap: '6px',
            background: 'var(--accent-color)',
            border: 'none'
          }}>
            <Download size={14} />
            <span style={{ fontSize: '0.8125rem' }}>Export HTML</span>
          </button>
        </div>
      </div>

      {/* Spacer for grid symmetry */}
      <div />
    </header>
  );
};
