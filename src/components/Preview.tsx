import React, { useState } from 'react';
import { X, Monitor, Smartphone, Globe } from 'lucide-react';
import { EmailRenderer } from './EmailRenderer.tsx';
import { type EmailBlock } from '../types.ts';
import { LANGUAGES, type LanguageId } from '../utils/translations.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';

interface PreviewProps {
  blocks: EmailBlock[];
  onClose: () => void;
}

export const Preview: React.FC<PreviewProps> = ({ 
  blocks, 
  onClose, 
}) => {
  const { language, setLanguage: onLanguageChange } = useTranslation();
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="preview-overlay">
      <div className="preview-toolbar">
        <div className="preview-title">
          <h2>Template Preview</h2>
        </div>
        
        <div className="preview-controls-center" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div className="device-selectors">
            <button 
              className={`device-button ${device === 'desktop' ? 'active' : ''}`}
              onClick={() => setDevice('desktop')}
              title="Desktop View"
            >
              <Monitor size={20} />
            </button>
            <button 
              className={`device-button ${device === 'mobile' ? 'active' : ''}`}
              onClick={() => setDevice('mobile')}
              title="Mobile View"
            >
              <Smartphone size={20} />
            </button>
          </div>

          <div className="language-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Globe size={16} color="var(--text-secondary)" />
            <select 
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageId)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white', 
                fontSize: '0.875rem', 
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id} style={{ background: '#1e293b', color: 'white' }}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="preview-close" onClick={onClose}>
          <X size={20} />
          <span>Close Preview</span>
        </button>
      </div>

      <div className="preview-content">
        <div className={`preview-viewport ${device}`}>
          {device === 'mobile' ? (
            <div className="preview-container mobile">
              <div className="mobile-bezel">
                <div className="camera"></div>
              </div>
              <div className="preview-scroll-area">
                <EmailRenderer blocks={blocks} isPreview />
              </div>
            </div>
          ) : (
            <div className="preview-container desktop">
              <div className="preview-scroll-area">
                <EmailRenderer blocks={blocks} isPreview />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
