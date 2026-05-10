import React from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Minus, 
  Maximize, 
  Share2, 
  Menu as MenuIcon, 
  Layout, 
  Columns, 
  Video, 
  Copy,
  Hash
} from 'lucide-react';
import { type BlockType } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';

interface SidebarProps {
  onAddBlock: (type: BlockType, options?: any) => void;
  onOpenTranslationManager: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddBlock, onOpenTranslationManager }) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const { translations } = useTranslation();
  const keys = Object.keys(translations.english);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(`{{${key}}}`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Layout</h3>
        <div className="sidebar-grid">
          <button className="sidebar-item" onClick={() => onAddBlock('row', { columns: ['100%'] })}>
            <Square size={20} />
            <span>1 Column</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('row', { columns: ['50%', '50%'] })}>
            <Columns size={20} />
            <span>2 Columns</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('row', { columns: ['33.33%', '33.33%', '33.33%'] })}>
            <Columns size={20} />
            <span>3 Columns</span>
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Blocks</h3>
        <div className="sidebar-grid">
          <button className="sidebar-item" onClick={() => onAddBlock('text')}>
            <Type size={20} />
            <span>Text</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('image')}>
            <ImageIcon size={20} />
            <span>Image</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('button')}>
            <Square size={20} />
            <span>Button</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('divider')}>
            <Minus size={20} />
            <span>Divider</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('spacer')}>
            <Maximize size={20} />
            <span>Spacer</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('social')}>
            <Share2 size={20} />
            <span>Social</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('menu')}>
            <MenuIcon size={20} />
            <span>Menu</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('hero')}>
            <Layout size={20} />
            <span>Hero</span>
          </button>
          <button className="sidebar-item" onClick={() => onAddBlock('video')}>
            <Video size={20} />
            <span>Video</span>
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>Translation Keys</h3>
          <button 
            onClick={onOpenTranslationManager}
            style={{ 
              fontSize: '0.7rem', 
              background: 'rgba(99, 102, 241, 0.2)', 
              color: '#a5b4fc', 
              border: '1px solid rgba(99, 102, 241, 0.3)', 
              padding: '2px 8px', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Manage
          </button>
        </div>
        <div className="token-list">
          {keys.map(key => (
            <div 
              key={key} 
              className="token-item" 
              onClick={() => copyToClipboard(key)}
              title={`Click to copy {{${key}}}`}
            >
              <div className="token-info">
                <Hash size={12} />
                <span>{key}</span>
              </div>
              {copiedKey === key ? (
                <span style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 'bold' }}>Copied!</span>
              ) : (
                <Copy size={12} className="copy-icon" />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
