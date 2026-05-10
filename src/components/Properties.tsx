import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { type EmailBlock, type EmailColumn } from '../types.ts';
import { TranslationPicker } from './TranslationPicker.tsx';

interface PropertiesProps {
  selectedBlock: EmailBlock | null;
  selectedColumn: EmailColumn | null;
  onChange: (id: string, updates: Partial<EmailBlock>) => void;
  onDelete: (id: string) => void;
  activeTab: 'content' | 'style';
  onTabChange: (tab: 'content' | 'style') => void;
}

export const Properties: React.FC<PropertiesProps> = ({ 
  selectedBlock, 
  onChange, 
}) => {
  if (!selectedBlock) {
    return (
      <aside className="properties-panel">
        <div className="panel-header">Properties</div>
        <div style={{ padding: '20px', color: '#94a3b8', fontSize: '0.875rem' }}>
          Select a block to edit its properties.
        </div>
      </aside>
    );
  }

  const handleStyleChange = (key: string, value: string) => {
    onChange(selectedBlock.id, {
      style: { ...selectedBlock.style, [key]: value }
    });
  };

  return (
    <aside className="properties-panel">
      <div className="panel-header">{selectedBlock.type} Properties</div>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 60px)' }}>
        
        {/* Content Section */}
        {selectedBlock.type !== 'spacer' && selectedBlock.type !== 'divider' && (
          <div className="property-group">
            <label style={labelStyle}>Content</label>
            {selectedBlock.type === 'text' || selectedBlock.type === 'button' ? (
              <>
                <textarea
                  style={inputStyle}
                  rows={3}
                  value={selectedBlock.content || ''}
                  onChange={(e) => onChange(selectedBlock.id, { content: e.target.value })}
                />
                <TranslationPicker onSelect={(key) => onChange(selectedBlock.id, { content: (selectedBlock.content || '') + key })} />
              </>
            ) : selectedBlock.type === 'image' ? (
              <input
                style={inputStyle}
                type="text"
                value={selectedBlock.content || ''}
                placeholder="Image URL"
                onChange={(e) => onChange(selectedBlock.id, { content: e.target.value })}
              />
            ) : null}
          </div>
        )}

        {/* Link Section */}
        {(selectedBlock.type === 'button' || selectedBlock.type === 'image') && (
          <div className="property-group">
            <label style={labelStyle}>Link (URL)</label>
            <input
              style={inputStyle}
              type="text"
              value={selectedBlock.url || ''}
              placeholder="https://example.com"
              onChange={(e) => onChange(selectedBlock.id, { url: e.target.value })}
            />
          </div>
        )}

        {/* Alignment Section */}
        {selectedBlock.type !== 'spacer' && selectedBlock.type !== 'divider' && (
          <div className="property-group">
            <label style={labelStyle}>Alignment</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => handleStyleChange('textAlign', align)}
                  style={{
                    ...buttonGroupStyle,
                    backgroundColor: selectedBlock.style.textAlign === align ? '#6366f1' : 'rgba(255,255,255,0.05)',
                  }}
                >
                  {align === 'left' && <AlignLeft size={16} />}
                  {align === 'center' && <AlignCenter size={16} />}
                  {align === 'right' && <AlignRight size={16} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Social Links Section */}
        {selectedBlock.type === 'social' && (
          <div className="property-group">
            <label style={labelStyle}>Social Links</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedBlock.socialLinks?.map((link, i) => (
                <div key={link.platform} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={link.active}
                      onChange={(e) => {
                        const newLinks = [...(selectedBlock.socialLinks || [])];
                        newLinks[i] = { ...newLinks[i], active: e.target.checked };
                        onChange(selectedBlock.id, { socialLinks: newLinks });
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'white', textTransform: 'capitalize' }}>
                      {link.platform === 'twitter' ? 'X (formerly Twitter)' : link.platform}
                    </span>
                  </div>
                  {link.active && (
                    <input
                      style={inputStyle}
                      type="text"
                      value={link.url}
                      placeholder={`${link.platform} URL`}
                      onChange={(e) => {
                        const newLinks = [...(selectedBlock.socialLinks || [])];
                        newLinks[i] = { ...newLinks[i], url: e.target.value };
                        onChange(selectedBlock.id, { socialLinks: newLinks });
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items Section */}
        {selectedBlock.type === 'menu' && (
          <div className="property-group">
            <label style={labelStyle}>Menu Items</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedBlock.menuItems?.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Item {i + 1}</span>
                    <button
                      onClick={() => {
                        const newItems = [...(selectedBlock.menuItems || [])];
                        newItems.splice(i, 1);
                        onChange(selectedBlock.id, { menuItems: newItems });
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem' }}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    style={inputStyle}
                    type="text"
                    value={item.label}
                    placeholder="Label"
                    onChange={(e) => {
                      const newItems = [...(selectedBlock.menuItems || [])];
                      newItems[i] = { ...newItems[i], label: e.target.value };
                      onChange(selectedBlock.id, { menuItems: newItems });
                    }}
                  />
                  <input
                    style={inputStyle}
                    type="text"
                    value={item.url}
                    placeholder="URL"
                    onChange={(e) => {
                      const newItems = [...(selectedBlock.menuItems || [])];
                      newItems[i] = { ...newItems[i], url: e.target.value };
                      onChange(selectedBlock.id, { menuItems: newItems });
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const newItems = [...(selectedBlock.menuItems || []), { label: 'New Item', url: '#' }];
                  onChange(selectedBlock.id, { menuItems: newItems });
                }}
                style={{
                  padding: '8px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  border: '1px dashed #6366f1',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                + Add Menu Item
              </button>
            </div>
          </div>
        )}

        {/* Hero Content Section */}
        {selectedBlock.type === 'hero' && (
          <div className="property-group">
            <label style={labelStyle}>Hero Content</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Title</label>
                <>
                  <input
                    style={inputStyle}
                    type="text"
                    value={selectedBlock.heroData?.title}
                    onChange={(e) => onChange(selectedBlock.id, { heroData: { ...selectedBlock.heroData!, title: e.target.value } })}
                  />
                  <TranslationPicker onSelect={(key) => onChange(selectedBlock.id, { heroData: { ...selectedBlock.heroData!, title: (selectedBlock.heroData?.title || '') + key } })} />
                </>
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Subtitle</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={selectedBlock.heroData?.subtitle}
                  onChange={(e) => onChange(selectedBlock.id, { heroData: { ...selectedBlock.heroData!, subtitle: e.target.value } })}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Button Text</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={selectedBlock.heroData?.buttonText}
                    onChange={(e) => onChange(selectedBlock.id, { heroData: { ...selectedBlock.heroData!, buttonText: e.target.value } })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Button URL</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={selectedBlock.heroData?.buttonUrl}
                    onChange={(e) => onChange(selectedBlock.id, { heroData: { ...selectedBlock.heroData!, buttonUrl: e.target.value } })}
                  />
                </div>
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Background Image URL</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedBlock.heroData?.backgroundImage}
                  onChange={(e) => onChange(selectedBlock.id, { heroData: { ...selectedBlock.heroData!, backgroundImage: e.target.value } })}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Overlay Color</label>
                  <input
                    style={{ ...inputStyle, height: '32px', padding: '2px' }}
                    type="color"
                    value={selectedBlock.heroData?.overlayColor}
                    onChange={(e) => onChange(selectedBlock.id, { heroData: { ...selectedBlock.heroData!, overlayColor: e.target.value } })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Overlay Opacity ({selectedBlock.heroData?.overlayOpacity})</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedBlock.heroData?.overlayOpacity}
                    onChange={(e) => onChange(selectedBlock.id, { heroData: { ...selectedBlock.heroData!, overlayOpacity: parseFloat(e.target.value) } })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Settings Section */}
        {selectedBlock.type === 'video' && (
          <div className="property-group">
            <label style={labelStyle}>Video Settings</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Thumbnail URL</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedBlock.videoData?.thumbnailUrl}
                  onChange={(e) => onChange(selectedBlock.id, { videoData: { ...selectedBlock.videoData!, thumbnailUrl: e.target.value } })}
                />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Video URL (YouTube/Vimeo)</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedBlock.videoData?.videoUrl}
                  onChange={(e) => onChange(selectedBlock.id, { videoData: { ...selectedBlock.videoData!, videoUrl: e.target.value } })}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Play Button Color</label>
                  <input
                    style={{ ...inputStyle, height: '32px', padding: '2px' }}
                    type="color"
                    value={selectedBlock.videoData?.playButtonColor}
                    onChange={(e) => onChange(selectedBlock.id, { videoData: { ...selectedBlock.videoData!, playButtonColor: e.target.value } })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Play Button Size</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={selectedBlock.videoData?.playButtonSize}
                    placeholder="e.g. 64px"
                    onChange={(e) => onChange(selectedBlock.id, { videoData: { ...selectedBlock.videoData!, playButtonSize: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Size Section */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedBlock.type !== 'spacer' && selectedBlock.type !== 'social' && selectedBlock.type !== 'menu' && (
            <div className="property-group" style={{ flex: 1 }}>
              <label style={labelStyle}>Width</label>
              <input
                style={inputStyle}
                type="text"
                value={selectedBlock.style.width || '100%'}
                placeholder="e.g. 100%, 200px"
                onChange={(e) => handleStyleChange('width', e.target.value)}
              />
            </div>
          )}
          {selectedBlock.type === 'social' && (
            <div className="property-group" style={{ flex: 1 }}>
              <label style={labelStyle}>Icon Size</label>
              <input
                style={inputStyle}
                type="text"
                value={selectedBlock.style.iconSize || '24px'}
                placeholder="e.g. 32px"
                onChange={(e) => handleStyleChange('iconSize', e.target.value)}
              />
            </div>
          )}
          {selectedBlock.type === 'menu' && (
            <>
              <div className="property-group" style={{ flex: 1 }}>
                <label style={labelStyle}>Item Spacing</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedBlock.style.itemSpacing || '20px'}
                  placeholder="e.g. 30px"
                  onChange={(e) => handleStyleChange('itemSpacing', e.target.value)}
                />
              </div>
              <div className="property-group" style={{ flex: 1 }}>
                <label style={labelStyle}>Font Size</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedBlock.style.fontSize || '14px'}
                  placeholder="e.g. 16px"
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                />
              </div>
            </>
          )}
          {(selectedBlock.type === 'button' || selectedBlock.type === 'spacer' || selectedBlock.type === 'hero') && (
            <div className="property-group" style={{ flex: 1 }}>
              <label style={labelStyle}>Height</label>
              <input
                style={inputStyle}
                type="text"
                value={selectedBlock.style.height || (selectedBlock.type === 'spacer' ? '20px' : 'auto')}
                placeholder="e.g. 500px"
                onChange={(e) => handleStyleChange('height', e.target.value)}
              />
            </div>
          )}
        </div>

        {selectedBlock.type === 'button' && (
          <div className="property-group">
            <label style={labelStyle}>Border Radius</label>
            <input
              style={inputStyle}
              type="text"
              value={selectedBlock.style.borderRadius || '4px'}
              placeholder="e.g. 8px, 50%"
              onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            />
          </div>
        )}
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0' }} />

        {/* Color Section */}
        <div className="property-group">
          <label style={labelStyle}>
            {selectedBlock.type === 'button' ? 'Button Color' : 'Background Color'}
          </label>
          <input
            style={inputStyle}
            type="color"
            value={selectedBlock.style.backgroundColor || (selectedBlock.type === 'button' ? '#6366f1' : '#ffffff')}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
        </div>

        <div className="property-group">
          <label style={labelStyle}>Block Background</label>
          <input
            style={inputStyle}
            type="color"
            value={selectedBlock.style.blockBackgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('blockBackgroundColor', e.target.value)}
          />
        </div>

        <div className="property-group">
          <label style={labelStyle}>Text Color</label>
          <input
            style={inputStyle}
            type="color"
            value={selectedBlock.style.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
        </div>

        <div className="property-group">
          <label style={labelStyle}>Padding</label>
          <input
            style={inputStyle}
            type="text"
            value={selectedBlock.style.padding || '20px'}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
          />
        </div>

        {selectedBlock.type === 'text' && (
          <div className="property-group">
            <label style={labelStyle}>Font Size</label>
            <select
              style={inputStyle}
              value={selectedBlock.style.fontSize || '16px'}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            >
              <option value="12px">Small</option>
              <option value="16px">Normal</option>
              <option value="24px">Large</option>
              <option value="32px">Heading</option>
            </select>
          </div>
        )}
      </div>
    </aside>
  );
};

const buttonGroupStyle: React.CSSProperties = {
  flex: 1,
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: '8px',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  color: 'white',
  padding: '8px',
  fontSize: '0.875rem',
  outline: 'none',
};
