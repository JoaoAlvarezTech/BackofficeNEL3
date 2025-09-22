import { useState, useEffect } from 'react';

export interface BiometricOptions {
  title?: string;
  subtitle?: string;
  description?: string;
  fallbackButtonTitle?: string;
  allowDeviceCredential?: boolean;
}

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometricType?: 'fingerprint' | 'face' | 'iris' | 'none';
}

// Simulação da API do Capacitor para demonstração
const mockBiometricAuth = {
  checkBiometry: async () => {
    // Simular verificação de biometria disponível
    return {
      available: true,
      biometryType: 'fingerprint' as const
    };
  },
  authenticate: async (options: BiometricOptions) => {
    // Simular autenticação biométrica
    return new Promise<{ verified: boolean }>((resolve) => {
      // Simular delay de autenticação
      setTimeout(() => {
        // Para demonstração, sempre retorna sucesso
        // Em produção, isso seria integrado com a API real do dispositivo
        resolve({ verified: true });
      }, 2000);
    });
  }
};

export const useBiometricAuth = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face' | 'iris' | 'none'>('none');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Verificar disponibilidade da biometria
  const checkAvailability = async (): Promise<boolean> => {
    try {
      const result = await mockBiometricAuth.checkBiometry();
      setIsAvailable(result.available);
      setBiometricType(result.biometryType || 'none');
      return result.available;
    } catch (error) {
      console.error('Erro ao verificar biometria:', error);
      setIsAvailable(false);
      return false;
    }
  };

  // Autenticar com biometria
  const authenticate = async (options?: BiometricOptions): Promise<BiometricResult> => {
    setIsLoading(true);
    
    try {
      const defaultOptions: BiometricOptions = {
        title: 'Autenticação Biométrica',
        subtitle: 'Use sua biometria para acessar o app',
        description: 'Toque no sensor ou olhe para a câmera',
        fallbackButtonTitle: 'Usar senha',
        allowDeviceCredential: true,
        ...options
      };

      const result = await mockBiometricAuth.authenticate(defaultOptions);
      
      if (result.verified) {
        return {
          success: true,
          biometricType
        };
      } else {
        return {
          success: false,
          error: 'Autenticação cancelada pelo usuário'
        };
      }
    } catch (error: unknown) {
      console.error('Erro na autenticação biométrica:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro na autenticação biométrica';
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar se a biometria está habilitada no dispositivo
  const isBiometricEnabled = async (): Promise<boolean> => {
    try {
      const result = await mockBiometricAuth.checkBiometry();
      return result.available;
    } catch (error) {
      console.error('Erro ao verificar biometria:', error);
      return false;
    }
  };

  // Habilitar biometria para o usuário
  const enableBiometric = async (): Promise<boolean> => {
    try {
      const result = await authenticate({
        title: 'Habilitar Biometria',
        subtitle: 'Configure o acesso biométrico',
        description: 'Autentique-se para habilitar o login biométrico'
      });
      
      if (result.success) {
        localStorage.setItem('biometricEnabled', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao habilitar biometria:', error);
      return false;
    }
  };

  // Desabilitar biometria
  const disableBiometric = (): void => {
    localStorage.removeItem('biometricEnabled');
  };

  // Verificar se a biometria está habilitada para o usuário
  const isBiometricEnabledForUser = (): boolean => {
    return localStorage.getItem('biometricEnabled') === 'true';
  };

  // Login com biometria
  const loginWithBiometric = async (): Promise<BiometricResult> => {
    if (!isBiometricEnabledForUser()) {
      return {
        success: false,
        error: 'Biometria não está habilitada para este usuário'
      };
    }

    return await authenticate({
      title: 'Login Biométrico',
      subtitle: 'Acesse sua conta com biometria',
      description: 'Toque no sensor ou olhe para a câmera'
    });
  };

  // Verificar disponibilidade na inicialização
  useEffect(() => {
    checkAvailability();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isAvailable,
    biometricType,
    isLoading,
    authenticate,
    checkAvailability,
    isBiometricEnabled,
    enableBiometric,
    disableBiometric,
    isBiometricEnabledForUser,
    loginWithBiometric
  };
};
