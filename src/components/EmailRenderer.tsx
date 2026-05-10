import React from 'react';
import { type EmailBlock } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';

interface EmailRendererProps {
  blocks: EmailBlock[];
  isPreview?: boolean;
}

export const EmailRenderer: React.FC<EmailRendererProps> = ({ blocks }) => {
  const { t } = useTranslation();
  return (
    <div className="email-renderer" style={{ backgroundColor: 'white', minHeight: '100%', width: '100%' }}>
      {blocks.map((block) => (
        <div 
          key={block.id} 
          style={{
            backgroundColor: block.style.blockBackgroundColor || '#ffffff',
            padding: block.style.padding || '0px',
            textAlign: block.style.textAlign as any || 'left',
          }}
        >
          <div style={{
            display: (block.style.width && block.style.width !== '100%') || block.type === 'button' ? 'inline-block' : 'block',
            width: block.style.width || '100%',
            backgroundColor: block.type !== 'button' ? block.style.backgroundColor : 'transparent',
            borderRadius: block.style.borderRadius,
            textAlign: 'left',
          }}>
            {renderBlock(block, t)}
          </div>
        </div>
      ))}
    </div>
  );
};

function renderBlock(block: EmailBlock, t: (text: string) => string) {
  switch (block.type) {
    case 'row':
      return (
        <div style={{ display: 'flex', width: '100%' }}>
          {block.columns?.map((column) => (
            <div key={column.id} style={{ width: column.width, minHeight: '20px' }}>
              <EmailRenderer blocks={column.blocks} isPreview />
            </div>
          ))}
        </div>
      );
    case 'text':
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: t(block.content || '') }} 
          style={{ 
            fontSize: block.style.fontSize || '16px', 
            padding: '20px',
            wordBreak: 'break-word',
            color: block.style.color,
          }} 
        />
      );
    case 'image':
      return (
        <img
          src={block.content || 'https://placehold.co/600x200?text=Email+Image'}
          alt="Email content"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      );
    case 'button':
      return (
        <div style={{ textAlign: 'center' }}>
          <a 
            href={block.url || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              textDecoration: 'none', 
              display: 'inline-block', 
              width: '100%',
              backgroundColor: block.style.backgroundColor || '#6366f1',
              color: block.style.color || 'white',
              padding: '12px 24px',
              borderRadius: block.style.borderRadius || '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              height: block.style.height || 'auto',
              lineHeight: block.style.height ? `${block.style.height}` : 'normal',
              boxSizing: 'border-box'
            }}
          >
            {t(block.content || '')}
          </a>
        </div>
      );
    case 'spacer':
      return <div style={{ height: block.style.height || '20px', width: '100%' }} />;
    case 'social':
      return (
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '20px',
          justifyContent: block.style.textAlign === 'left' ? 'flex-start' : block.style.textAlign === 'right' ? 'flex-end' : 'center', 
          flexWrap: 'wrap' 
        }}>
          {block.socialLinks?.filter(l => l.active).map((link, i) => {
            const size = parseInt(block.style.iconSize || '24px');
            return (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: block.style.color || 'inherit' }}>
                <SocialIcon platform={link.platform} size={size} />
              </a>
            );
          })}
        </div>
      );
    case 'menu':
      return (
        <div style={{ 
          display: 'flex', 
          gap: block.style.itemSpacing || '20px', 
          justifyContent: block.style.textAlign === 'left' ? 'flex-start' : block.style.textAlign === 'right' ? 'flex-end' : 'center', 
          flexWrap: 'wrap', 
          padding: '10px' 
        }}>
          {block.menuItems?.map((item, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: block.style.color || '#6366f1', 
                textDecoration: 'none',
                fontSize: block.style.fontSize || '14px',
                fontWeight: '500'
              }}
            >
              {t(item.label || '')}
            </a>
          ))}
        </div>
      );
    case 'hero':
      return (
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: block.style.height || '400px', 
          backgroundImage: `url(${block.heroData?.backgroundImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: block.style.color || 'white',
          padding: block.style.padding || '40px',
          textAlign: 'center',
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: block.heroData?.overlayColor || 'black', 
            opacity: block.heroData?.overlayOpacity || 0.4,
            zIndex: 1 
          }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '80%' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>{t(block.heroData?.title || '')}</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{t(block.heroData?.subtitle || '')}</p>
            {block.heroData?.buttonText && (
              <a 
                href={block.heroData.buttonUrl} 
                style={{
                  display: 'inline-block',
                  backgroundColor: block.style.backgroundColor || '#6366f1',
                  color: block.style.color || 'white',
                  padding: '12px 32px',
                  borderRadius: block.style.borderRadius || '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                {t(block.heroData.buttonText)}
              </a>
            )}
          </div>
        </div>
      );
    case 'video':
      return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
          <a href={block.videoData?.videoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'relative' }}>
            <img 
              src={block.videoData?.thumbnailUrl} 
              alt="Video Thumbnail" 
              style={{ width: '100%', display: 'block', borderRadius: block.style.borderRadius || '4px' }}
            />
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: block.videoData?.playButtonSize || '64px',
              height: block.videoData?.playButtonSize || '64px',
              backgroundColor: block.videoData?.playButtonColor || '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}>
              <svg width="30%" height="30%" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </a>
        </div>
      );
    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />;
    default:
      return null;
  }
}

const SocialIcon: React.FC<{ platform: string; size: number }> = ({ platform, size }) => {
  const SVGs: Record<string, React.ReactNode> = {
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    twitter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
      </svg>
    ),
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    linkedin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/>
      </svg>
    ),
    youtube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48L15.45 11.75l-5.7 3.27z"/>
      </svg>
    ),
    github: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
      </svg>
    )
  };
  return SVGs[platform] || null;
};
