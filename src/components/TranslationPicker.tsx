import { DEFAULT_LANGUAGE } from '../utils/translations.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useDynamicKeys } from '../contexts/DynamicKeyContext.tsx';

interface TranslationPickerProps {
  onSelect: (key: string) => void;
}

export const TranslationPicker: React.FC<TranslationPickerProps> = ({ onSelect }) => {
  const { translations } = useTranslation();
  const { dynamicKeys } = useDynamicKeys();
  const keys = Object.keys(translations[DEFAULT_LANGUAGE]);

  return (
    <div style={{ marginTop: '8px' }}>
      <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
        Insert Translation or Dynamic Key
      </label>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '4px',
        maxHeight: '120px',
        overflowY: 'auto',
        padding: '8px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {keys.map(key => (
          <button
            key={key}
            onClick={() => onSelect(`{{${key}}}`)}
            title={translations[DEFAULT_LANGUAGE][key]}
            style={{
              padding: '2px 8px',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              color: '#a5b4fc',
              fontSize: '0.7rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            }}
          >
            {key}
          </button>
        ))}
        {dynamicKeys.map(key => (
          <button
            key={key}
            onClick={() => onSelect(`{{${key}}}`)}
            title={`Dynamic placeholder: ${key}`}
            style={{
              padding: '2px 8px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              color: '#6ee7b7',
              fontSize: '0.7rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};
