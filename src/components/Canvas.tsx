import React, { useCallback, useMemo } from 'react';
import { 
  Trash2, 
  GripVertical, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Link as LinkIcon
} from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { type EmailBlock } from '../types.ts';

interface CanvasProps {
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  selectedColumnId: string | null;
  onSelectColumn: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: Partial<EmailBlock>) => void;
}

const RichTextEditor: React.FC<{
  content: string;
  onChange: (html: string) => void;
  style: any;
  isSelected: boolean;
}> = ({ content, onChange, style, isSelected }) => {
  const [, setUpdate] = React.useState(0);

  const extensions = useMemo(() => [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Enter your text here...',
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        style: 'color: #6366f1; text-decoration: underline; cursor: pointer;',
      },
    }),
  ], []);

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onTransaction: () => {
      setUpdate((v) => v + 1);
    },
  });

  // Keep editor content in sync with external prop changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div style={{ ...style, position: 'relative' }}>
      {isSelected && (
        <div className="rich-text-toolbar">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            title="Heading 2"
          >
            H2
          </button>
          <div className="toolbar-divider" />
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
            title="Strike"
          >
            S
          </button>
          <button
            onClick={setLink}
            className={editor.isActive('link') ? 'is-active' : ''}
            title="Add Link"
          >
            <LinkIcon size={14} />
          </button>
          <div className="toolbar-divider" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
            title="Ordered List"
          >
            1.
          </button>
          <div className="toolbar-divider" />
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
            title="Align Left"
          >
            <AlignLeft size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
            title="Align Center"
          >
            <AlignCenter size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
            title="Align Right"
          >
            <AlignRight size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
            title="Justify"
          >
            <AlignJustify size={14} />
          </button>
          <div className="toolbar-divider" />
          <button onClick={() => editor.chain().focus().undo().run()} title="Undo">
            ↺
          </button>
          <button onClick={() => editor.chain().focus().redo().run()} title="Redo">
            ↻
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export const Canvas: React.FC<CanvasProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  selectedColumnId,
  onSelectColumn,
  onDeleteBlock,
  onUpdateBlock,
}) => {
  return (
    <main className="canvas-container" onClick={() => { onSelectBlock(null); onSelectColumn(null); }}>
      <div className="canvas">
        {blocks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Choose a layout or block from the sidebar to start.
          </div>
        ) : (
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <CanvasBlock
                key={block.id}
                block={block}
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
                selectedColumnId={selectedColumnId}
                onSelectColumn={onSelectColumn}
                onDeleteBlock={onDeleteBlock}
                onUpdateBlock={onUpdateBlock}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </main>
  );
};

const DroppableColumn: React.FC<{
  id: string;
  width: string;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}> = ({ id, width, isSelected, onClick, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      style={{
        width,
        minHeight: '80px',
        border: isSelected ? '2px solid #6366f1' : isOver ? '2px dashed #6366f1' : '1px dashed rgba(0,0,0,0.1)',
        backgroundColor: isOver ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </div>
  );
};

const CanvasBlock: React.FC<{
  block: EmailBlock;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  selectedColumnId: string | null;
  onSelectColumn: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: Partial<EmailBlock>) => void;
}> = ({ block, selectedBlockId, onSelectBlock, selectedColumnId, onSelectColumn, onDeleteBlock, onUpdateBlock }) => {
  const isSelected = selectedBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const containerStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
    textAlign: block.style.textAlign || 'left',
    width: '100%',
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: block.style.blockBackgroundColor || (block.type !== 'button' ? block.style.backgroundColor : 'transparent'),
    color: block.style.color,
    padding: block.style.padding || '0px',
    borderRadius: block.style.borderRadius,
    width: block.style.width || '100%',
    display: (block.style.width && block.style.width !== '100%') || block.type === 'button' ? 'inline-block' : 'block',
    textAlign: 'left',
  };

  return (
    <div
      ref={setNodeRef}
      style={containerStyle}
      className={`canvas-block ${block.type} ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelectBlock(block.id);
        onSelectColumn(null);
      }}
    >
      {isSelected && (
        <div className="block-actions">
          <div className="action-button drag-handle" {...attributes} {...listeners}>
            <GripVertical size={14} />
          </div>
          <button
            className="action-button delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBlock(block.id);
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
      <div className="block-content" style={contentStyle}>
        {renderBlockContent(block, selectedBlockId, onSelectBlock, selectedColumnId, onSelectColumn, onDeleteBlock, onUpdateBlock)}
      </div>
    </div>
  );
};

function renderBlockContent(
  block: EmailBlock,
  selectedBlockId: string | null,
  onSelectBlock: (id: string | null) => void,
  selectedColumnId: string | null,
  onSelectColumn: (id: string | null) => void,
  onDeleteBlock: (id: string) => void,
  onUpdateBlock: (id: string, updates: Partial<EmailBlock>) => void
) {
  switch (block.type) {
    case 'row':
      return (
        <div style={{ display: 'flex', width: '100%' }}>
          {block.columns?.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              width={column.width}
              isSelected={selectedColumnId === column.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectColumn(column.id);
                onSelectBlock(null);
              }}
            >
              <SortableContext items={column.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {column.blocks.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#cbd5e1',
                      fontSize: '0.75rem',
                      padding: '10px',
                    }}
                  >
                    {selectedColumnId === column.id ? 'Column Selected' : 'Empty Column'}
                  </div>
                ) : (
                  column.blocks.map((innerBlock) => (
                    <CanvasBlock
                      key={innerBlock.id}
                      block={innerBlock}
                      selectedBlockId={selectedBlockId}
                      onSelectBlock={onSelectBlock}
                      selectedColumnId={selectedColumnId}
                      onSelectColumn={onSelectColumn}
                      onDeleteBlock={onDeleteBlock}
                      onUpdateBlock={onUpdateBlock}
                    />
                  ))
                )}
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>
      );
    case 'text':
      return (
        <RichTextEditor
          content={block.content || ''}
          onChange={(html) => onUpdateBlock(block.id, { content: html })}
          isSelected={selectedBlockId === block.id}
          style={{ 
            fontSize: block.style.fontSize || '16px', 
            padding: '20px',
            wordBreak: 'break-word',
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
          {block.url ? (
            <a 
              href={block.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}
              onClick={(e) => (block.id === selectedBlockId) && e.preventDefault()}
            >
              <button
                style={{
                  backgroundColor: block.style.backgroundColor || '#6366f1',
                  color: block.style.color || 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: block.style.borderRadius || '4px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '100%', // Take full width of the parent (which is .block-content)
                  height: block.style.height || 'auto',
                }}
              >
                {block.content}
              </button>
            </a>
          ) : (
            <button
              style={{
                backgroundColor: block.style.backgroundColor || '#6366f1',
                color: block.style.color || 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: block.style.borderRadius || '4px',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%',
                height: block.style.height || 'auto',
              }}
            >
              {block.content}
            </button>
          )}
        </div>
      );
    case 'spacer':
      return <div style={{ height: block.style.height || '20px', width: '100%' }} />;
    case 'social':
      return (
        <div style={{ display: 'flex', gap: '12px', justifyContent: block.style.textAlign === 'left' ? 'flex-start' : block.style.textAlign === 'right' ? 'flex-end' : 'center', flexWrap: 'wrap' }}>
          {block.socialLinks?.filter(l => l.active).map((link, i) => {
            const size = parseInt(block.style.iconSize || '24px');
            
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

            return (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => (block.id === selectedBlockId) && e.preventDefault()}
                style={{ color: block.style.color || 'inherit' }}
              >
                {SVGs[link.platform]}
              </a>
            );
          })}
        </div>
      );
    case 'menu':
      return (
        <div style={{ display: 'flex', gap: block.style.itemSpacing || '20px', justifyContent: block.style.textAlign === 'left' ? 'flex-start' : block.style.textAlign === 'right' ? 'flex-end' : 'center', flexWrap: 'wrap', padding: '10px' }}>
          {block.menuItems?.map((item, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => (block.id === selectedBlockId) && e.preventDefault()}
              style={{ 
                color: block.style.color || '#6366f1', 
                textDecoration: 'none',
                fontSize: block.style.fontSize || '14px',
                fontWeight: '500'
              }}
            >
              {item.label}
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
          {/* Overlay */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: block.heroData?.overlayColor || 'black', 
            opacity: block.heroData?.overlayOpacity || 0.4,
            zIndex: 1 
          }} />
          
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '80%' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>{block.heroData?.title}</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{block.heroData?.subtitle}</p>
            {block.heroData?.buttonText && (
              <a 
                href={block.heroData.buttonUrl} 
                onClick={(e) => (block.id === selectedBlockId) && e.preventDefault()}
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
                {block.heroData.buttonText}
              </a>
            )}
          </div>
        </div>
      );
    case 'video':
      return (
        <div className="video-block-container" style={{ position: 'relative', width: '100%', maxWidth: '100%', cursor: 'pointer' }}>
          <a 
            href={block.videoData?.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => (block.id === selectedBlockId) && e.preventDefault()}
            style={{ display: 'block', position: 'relative' }}
          >
            <img 
              src={block.videoData?.thumbnailUrl} 
              alt="Video Thumbnail" 
              style={{ width: '100%', display: 'block', borderRadius: block.style.borderRadius || '4px' }}
            />
            {/* Play Button Overlay */}
            <div 
              className="video-play-button"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: block.videoData?.playButtonSize || '64px',
                height: block.videoData?.playButtonSize || '64px',
                backgroundColor: block.videoData?.playButtonColor || '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 2
              }}
            >
              <svg width="30%" height="30%" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            {/* Hover Shine Effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0)',
              transition: 'background-color 0.3s ease',
              borderRadius: block.style.borderRadius || '4px'
            }} className="video-overlay" />
          </a>
        </div>
      );
    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />;
    default:
      return null;
  }
}
