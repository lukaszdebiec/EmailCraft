import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface DynamicKeyContextType {
  dynamicKeys: string[];
  addDynamicKey: (key: string) => void;
  deleteDynamicKey: (key: string) => void;
  setDynamicKeys: (keys: string[]) => void;
}

const DynamicKeyContext = createContext<DynamicKeyContextType | undefined>(undefined);

const DEFAULT_DYNAMIC_KEYS = [
  'first-name',
  'last-name',
  'activity-name',
  'activity-description',
  'location-name'
];

export const DynamicKeyProvider = ({ children }: { children: ReactNode }) => {
  const [dynamicKeys, setDynamicKeys] = useState<string[]>(DEFAULT_DYNAMIC_KEYS);

  const addDynamicKey = useCallback((key: string) => {
    setDynamicKeys(prev => {
      if (prev.includes(key)) return prev;
      return [...prev, key];
    });
  }, []);

  const deleteDynamicKey = useCallback((key: string) => {
    setDynamicKeys(prev => prev.filter(k => k !== key));
  }, []);

  return (
    <DynamicKeyContext.Provider value={{ 
      dynamicKeys, 
      addDynamicKey, 
      deleteDynamicKey,
      setDynamicKeys
    }}>
      {children}
    </DynamicKeyContext.Provider>
  );
};

export const useDynamicKeys = () => {
  const context = useContext(DynamicKeyContext);
  if (context === undefined) {
    throw new Error('useDynamicKeys must be used within a DynamicKeyProvider');
  }
  return context;
};
