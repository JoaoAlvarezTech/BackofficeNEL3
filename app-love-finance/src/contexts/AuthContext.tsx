import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authenticateUser, login as authLogin, logout as authLogout, isAuthenticated, getCurrentUser } from '@/lib/auth';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithBiometric: () => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  biometricAuth: ReturnType<typeof useBiometricAuth>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const biometricAuth = useBiometricAuth();

  useEffect(() => {
    // Check if user is already authenticated on app load
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const authenticatedUser = authenticateUser(email, password);
    if (authenticatedUser) {
      authLogin(authenticatedUser);
      setUser(authenticatedUser);
      return true;
    }
    return false;
  };

  const loginWithBiometric = async (): Promise<boolean> => {
    try {
      const result = await biometricAuth.loginWithBiometric();
      
      if (result.success) {
        // Se a biometria foi bem-sucedida, buscar o usuário atual
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          return true;
        } else {
          // Se não há usuário salvo, usar o usuário padrão
          const defaultUser = authenticateUser('admin@admin', '123123');
          if (defaultUser) {
            authLogin(defaultUser);
            setUser(defaultUser);
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Erro no login biométrico:', error);
      return false;
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithBiometric,
    logout,
    loading,
    biometricAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
