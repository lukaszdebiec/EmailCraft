import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Sidebar } from './components/Sidebar.tsx';
import { Canvas } from './components/Canvas.tsx';
import { Properties } from './components/Properties.tsx';
import { Header } from './components/Header.tsx';
import { Preview } from './components/Preview.tsx';
import { TranslationManager } from './components/TranslationManager.tsx';
import { type EmailBlock, type BlockType, type EmailColumn } from './types.ts';
import { generateEmailHtml } from './utils/HtmlGenerator.ts';
import { TranslationProvider } from './contexts/TranslationContext.tsx';
import { DynamicKeyProvider } from './contexts/DynamicKeyContext.tsx';
import { DynamicKeyManager } from './components/DynamicKeyManager.tsx';
import { useTranslation } from './contexts/TranslationContext.tsx';
import { useDynamicKeys } from './contexts/DynamicKeyContext.tsx';
import './index.css';

function EmailBuilder() {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showTranslationManager, setShowTranslationManager] = useState(false);
  const [showDynamicKeyManager, setShowDynamicKeyManager] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<Record<string, any>>({});
  const [currentTemplateName, setCurrentTemplateName] = useState<string | null>(null);

  const { translations, setTranslations } = useTranslation();
  const { dynamicKeys, setDynamicKeys } = useDynamicKeys();

  // Load templates on mount
  useEffect(() => {
    const stored = localStorage.getItem('email-craft-templates');
    if (stored) {
      try {
        setSavedTemplates(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved templates', e);
      }
    }
  }, []);

  const saveTemplate = (name: string) => {
    const newTemplates = {
      ...savedTemplates,
      [name]: {
        blocks,
        translations,
        dynamicKeys,
        updatedAt: new Date().toISOString()
      }
    };
    setSavedTemplates(newTemplates);
    localStorage.setItem('email-craft-templates', JSON.stringify(newTemplates));
    setCurrentTemplateName(name);
  };

  const loadTemplate = (name: string) => {
    const template = savedTemplates[name];
    if (template) {
      setBlocks(template.blocks || []);
      if (template.translations) setTranslations(template.translations);
      if (template.dynamicKeys) setDynamicKeys(template.dynamicKeys);
      setCurrentTemplateName(name);
      setSelectedBlockId(null);
      setSelectedColumnId(null);
    }
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addBlock = (type: BlockType, options?: any) => {
    const newBlock: EmailBlock = {
      id: generateId(),
      type,
      content: getDefaultContent(type),
      style: getDefaultStyle(type),
      socialLinks: type === 'social' ? [
        { platform: 'facebook', url: '#', active: true },
        { platform: 'twitter', url: '#', active: true },
        { platform: 'instagram', url: '#', active: true },
        { platform: 'linkedin', url: '#', active: false },
        { platform: 'youtube', url: '#', active: false },
      ] : undefined,
      menuItems: type === 'menu' ? [
        { label: 'Home', url: '#' },
        { label: 'Shop', url: '#' },
        { label: 'Contact', url: '#' },
      ] : undefined,
      heroData: type === 'hero' ? {
        title: 'Hero Title Here',
        subtitle: 'This is your subtitle to provide more details about the offer.',
        buttonText: 'Learn More',
        buttonUrl: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop',
        overlayOpacity: 0.4,
        overlayColor: '#000000',
      } : undefined,
      videoData: type === 'video' ? {
        thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        playButtonColor: '#ef4444',
        playButtonSize: '64px',
      } : undefined,
      columns: type === 'row' ? options.columns.map((width: string) => ({
        id: generateId(),
        width,
        blocks: []
      })) : undefined
    };

    if (selectedColumnId) {
      const addToColumn = (list: EmailBlock[]): EmailBlock[] => {
        return list.map((block) => {
          if (block.columns) {
            return {
              ...block,
              columns: block.columns.map((col) => {
                if (col.id === selectedColumnId) {
                  return { ...col, blocks: [...col.blocks, newBlock] };
                }
                return { ...col, blocks: addToColumn(col.blocks) };
              }),
            };
          }
          return block;
        });
      };
      setBlocks(addToColumn(blocks));
    } else {
      setBlocks([...blocks, newBlock]);
    }
    
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<EmailBlock>) => {
    const updateInList = (list: EmailBlock[]): EmailBlock[] => {
      return list.map((block) => {
        if (block.id === id) {
          return { ...block, ...updates };
        }
        if (block.columns) {
          return {
            ...block,
            columns: block.columns.map((col) => ({
              ...col,
              blocks: updateInList(col.blocks),
            })),
          };
        }
        return block;
      });
    };
    setBlocks(updateInList(blocks));
  };

  const deleteBlock = (id: string) => {
    const removeFromList = (list: EmailBlock[]): EmailBlock[] => {
      return list
        .filter((block) => block.id !== id)
        .map((block) => ({
          ...block,
          columns: block.columns?.map((col) => ({
            ...col,
            blocks: removeFromList(col.blocks),
          })),
        }));
    };
    setBlocks(removeFromList(blocks));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string, list: EmailBlock[]): { block: EmailBlock | null, colId: string | null } => {
    for (const block of list) {
      if (block.id === id) return { block, colId: 'root' };
      if (block.columns) {
        for (const col of block.columns) {
          if (col.id === id) return { block: null, colId: col.id };
          const found = col.blocks.find(b => b.id === id);
          if (found) return { block: found, colId: col.id };
          const nested = findContainer(id, col.blocks);
          if (nested.block) return nested;
        }
      }
    }
    return { block: null, colId: null };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    setBlocks((prevBlocks) => {
      const activeContainer = findContainer(activeId, prevBlocks);
      const overContainer = findContainer(overId, prevBlocks);

      if (!activeContainer.colId || !overContainer.colId) return prevBlocks;

      const removeBlock = (list: EmailBlock[]): { newList: EmailBlock[], removedBlock: EmailBlock | null } => {
        let removedBlock: EmailBlock | null = null;
        const newList = list.filter(b => {
          if (b.id === activeId) {
            removedBlock = b;
            return false;
          }
          return true;
        }).map(b => {
          if (b.columns) {
            const { newList: newColsBlocks, removedBlock: found } = removeBlockFromCols(b.columns);
            if (found) removedBlock = found;
            return { ...b, columns: newColsBlocks };
          }
          return b;
        });
        return { newList, removedBlock };
      };

      const removeBlockFromCols = (cols: EmailColumn[]): { newList: EmailColumn[], removedBlock: EmailBlock | null } => {
        let removedBlock: EmailBlock | null = null;
        const newList = cols.map(col => {
          const { newList: newBlocks, removedBlock: found } = removeBlock(col.blocks);
          if (found) removedBlock = found;
          return { ...col, blocks: newBlocks };
        });
        return { newList, removedBlock };
      };

      const insertBlock = (list: EmailBlock[], blockToInsert: EmailBlock): EmailBlock[] => {
        const targetColId = overContainer.colId === overId ? overId : overContainer.colId;

        if (targetColId === 'root') {
          const overIndex = list.findIndex(b => b.id === overId);
          const newList = [...list];
          newList.splice(overIndex >= 0 ? overIndex : newList.length, 0, blockToInsert);
          return newList;
        }

        return list.map(b => {
          if (b.columns) {
            return {
              ...b,
              columns: b.columns.map(col => {
                if (col.id === targetColId) {
                  const overIndex = col.blocks.findIndex(inner => inner.id === overId);
                  const newBlocks = [...col.blocks];
                  const insertIndex = overIndex >= 0 ? overIndex : newBlocks.length;
                  newBlocks.splice(insertIndex, 0, blockToInsert);
                  return { ...col, blocks: newBlocks };
                }
                return { ...col, blocks: insertBlock(col.blocks, blockToInsert) };
              })
            };
          }
          return b;
        });
      };

      const { newList: withoutActive, removedBlock } = removeBlock(prevBlocks);
      if (!removedBlock) return prevBlocks;

      return insertBlock(withoutActive, removedBlock);
    });
  };

  const findBlockById = (id: string, list: EmailBlock[]): EmailBlock | null => {
    for (const block of list) {
      if (block.id === id) return block;
      if (block.columns) {
        for (const col of block.columns) {
          const found = findBlockById(id, col.blocks);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const handleExport = () => {
    const html = generateEmailHtml(blocks);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    setBlocks([]);
    setSelectedBlockId(null);
    setSelectedColumnId(null);
    setShowResetModal(false);
  };

  const findColumnById = (id: string, list: EmailBlock[]): EmailColumn | null => {
    for (const block of list) {
      if (block.columns) {
        for (const col of block.columns) {
          if (col.id === id) return col;
          const found = findColumnById(id, col.blocks);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const selectedBlock = selectedBlockId ? findBlockById(selectedBlockId, blocks) : null;
  const selectedColumn = selectedColumnId ? findColumnById(selectedColumnId, blocks) : null;

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onExport={handleExport}
        onReset={() => setShowResetModal(true)}
        savedTemplates={Object.keys(savedTemplates)}
        onSaveTemplate={saveTemplate}
        onLoadTemplate={loadTemplate}
        currentTemplateName={currentTemplateName}
      />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          <Sidebar 
            onAddBlock={addBlock} 
            onOpenTranslationManager={() => setShowTranslationManager(true)}
            onOpenDynamicKeyManager={() => setShowDynamicKeyManager(true)}
          />
          <Canvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            selectedColumnId={selectedColumnId}
            onSelectColumn={setSelectedColumnId}
            onDeleteBlock={deleteBlock}
            onUpdateBlock={updateBlock}
          />
          <Properties
            selectedBlock={selectedBlock}
            selectedColumn={selectedColumn}
            onChange={updateBlock}
            onDelete={deleteBlock}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </DndContext>
      </div>

      {showTranslationManager && (
        <TranslationManager onClose={() => setShowTranslationManager(false)} />
      )}

      {showDynamicKeyManager && (
        <DynamicKeyManager onClose={() => setShowDynamicKeyManager(false)} />
      )}

      {viewMode === 'preview' && (
        <Preview 
          blocks={blocks} 
          onClose={() => setViewMode('edit')} 
        />
      )}

      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Start Over?</h3>
              <button className="close-btn" onClick={() => setShowResetModal(false)}>
                <X size={20} />
              </button>
            </div>
            <p style={{ textAlign: 'left', marginBottom: '32px' }}>Are you sure you want to clear the canvas? All your current progress will be lost forever.</p>
            <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowResetModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: '#ef4444' }} onClick={handleStartOver}>Yes, Start Over</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getDefaultContent(type: BlockType): string {
  switch (type) {
    case 'text':
      return '';
    case 'image':
      return '';
    case 'button':
      return 'Click Me';
    case 'divider':
      return '';
    case 'spacer':
      return '';
    case 'social':
      return '';
    case 'menu':
      return '';
    case 'hero':
      return '';
    case 'video':
      return '';
    default:
      return '';
  }
}

function getDefaultStyle(type: BlockType): any {
  const base = {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '20px',
  };

  if (type === 'button') {
    return {
      ...base,
      backgroundColor: '#6366f1',
      color: '#ffffff',
      textAlign: 'center',
      borderRadius: '4px',
      width: 'auto',
      height: 'auto',
    };
  }

  if (type === 'divider') {
    return {
      ...base,
      padding: '10px 0',
    };
  }

  if (type === 'spacer') {
    return {
      ...base,
      padding: '0',
      height: '20px',
      backgroundColor: 'transparent',
    };
  }

  if (type === 'social') {
    return {
      ...base,
      textAlign: 'center',
      iconSize: '24px',
    };
  }

  if (type === 'menu') {
    return {
      ...base,
      textAlign: 'center',
      fontSize: '14px',
      itemSpacing: '20px',
    };
  }

  if (type === 'hero') {
    return {
      ...base,
      textAlign: 'center',
      color: '#ffffff',
      backgroundColor: '#6366f1',
      height: '400px',
      padding: '40px',
    };
  }

  if (type === 'video') {
    return {
      ...base,
      textAlign: 'center',
    };
  }

  return base;
}

function App() {
  return (
    <TranslationProvider>
      <DynamicKeyProvider>
        <EmailBuilder />
      </DynamicKeyProvider>
    </TranslationProvider>
  );
}

export default App;
