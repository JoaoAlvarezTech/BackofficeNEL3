import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PixKey {
  id: string;
  type: 'celular' | 'email' | 'cpf' | 'cnpj' | 'aleatoria';
  value: string;
  name?: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
}

interface PixKeysContextType {
  pixKeys: PixKey[];
  addPixKey: (key: Omit<PixKey, 'id' | 'createdAt'>) => Promise<boolean>;
  updatePixKey: (id: string, updates: Partial<PixKey>) => Promise<boolean>;
  removePixKey: (id: string) => Promise<boolean>;
  activatePixKey: (id: string) => Promise<boolean>;
  deactivatePixKey: (id: string) => Promise<boolean>;
  getActivePixKeys: () => PixKey[];
  validatePixKey: (type: PixKey['type'], value: string) => { isValid: boolean; error?: string };
  generateRandomKey: () => string;
}

const PixKeysContext = createContext<PixKeysContextType | undefined>(undefined);

export const usePixKeys = () => {
  const context = useContext(PixKeysContext);
  if (!context) {
    throw new Error('usePixKeys must be used within a PixKeysProvider');
  }
  return context;
};

interface PixKeysProviderProps {
  children: React.ReactNode;
}

export const PixKeysProvider: React.FC<PixKeysProviderProps> = ({ children }) => {
  const [pixKeys, setPixKeys] = useState<PixKey[]>(() => {
    const savedKeys = localStorage.getItem('pix_keys');
    if (savedKeys) {
      const parsed = JSON.parse(savedKeys);
      return parsed.map((key: any) => ({
        ...key,
        createdAt: new Date(key.createdAt),
        lastUsed: key.lastUsed ? new Date(key.lastUsed) : undefined
      }));
    }
    
    // Array vazio - sem chaves padrão
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pix_keys', JSON.stringify(pixKeys));
  }, [pixKeys]);

  const validatePixKey = (type: PixKey['type'], value: string): { isValid: boolean; error?: string } => {
    switch (type) {
      case 'celular':
        const phoneRegex = /^[1-9]{2}9?[0-9]{8}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) {
          return { isValid: false, error: 'Celular deve ter 10 ou 11 dígitos' };
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { isValid: false, error: 'E-mail inválido' };
        }
        break;
      
      case 'cpf':
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(value)) {
          return { isValid: false, error: 'CPF deve estar no formato XXX.XXX.XXX-XX' };
        }
        break;
      
      case 'cnpj':
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        if (!cnpjRegex.test(value)) {
          return { isValid: false, error: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX' };
        }
        break;
      
      case 'aleatoria':
        if (value.length < 8 || value.length > 32) {
          return { isValid: false, error: 'Chave aleatória deve ter entre 8 e 32 caracteres' };
        }
        break;
    }

    // Verificar se a chave já existe
    const existingKey = pixKeys.find(key => 
      key.value === value && key.type === type && key.id !== 'temp'
    );
    if (existingKey) {
      return { isValid: false, error: 'Esta chave PIX já está cadastrada' };
    }

    return { isValid: true };
  };

  const generateRandomKey = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'pix-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const addPixKey = async (key: Omit<PixKey, 'id' | 'createdAt'>): Promise<boolean> => {
    const validation = validatePixKey(key.type, key.value);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const newKey: PixKey = {
      ...key,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    setPixKeys(prev => [...prev, newKey]);
    return true;
  };

  const updatePixKey = async (id: string, updates: Partial<PixKey>): Promise<boolean> => {
    setPixKeys(prev => prev.map(key => 
      key.id === id ? { ...key, ...updates } : key
    ));
    return true;
  };

  const removePixKey = async (id: string): Promise<boolean> => {
    setPixKeys(prev => prev.filter(key => key.id !== id));
    return true;
  };

  const activatePixKey = async (id: string): Promise<boolean> => {
    return updatePixKey(id, { isActive: true });
  };

  const deactivatePixKey = async (id: string): Promise<boolean> => {
    return updatePixKey(id, { isActive: false });
  };

  const getActivePixKeys = (): PixKey[] => {
    return pixKeys.filter(key => key.isActive);
  };

  const value: PixKeysContextType = {
    pixKeys,
    addPixKey,
    updatePixKey,
    removePixKey,
    activatePixKey,
    deactivatePixKey,
    getActivePixKeys,
    validatePixKey,
    generateRandomKey
  };

  return (
    <PixKeysContext.Provider value={value}>
      {children}
    </PixKeysContext.Provider>
  );
};
