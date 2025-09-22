import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Fingerprint,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFallback?: () => void;
  title?: string;
  description?: string;
  operation?: string;
}

const BiometricAuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  onFallback,
  title = "Autenticação Biométrica",
  description = "Confirme sua identidade para continuar",
  operation = "esta operação"
}: BiometricAuthModalProps) => {
  const { biometricAuth } = useAuth();
  const { toast } = useToast();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authResult, setAuthResult] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    if (isOpen) {
      handleBiometricAuth();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBiometricAuth = async () => {
    if (!biometricAuth.isAvailable) {
      toast({
        title: "Biometria não disponível",
        description: "A autenticação biométrica não está disponível no seu dispositivo.",
        variant: "destructive",
      });
      onClose();
      return;
    }

    if (!biometricAuth.isBiometricEnabledForUser()) {
      toast({
        title: "Biometria não configurada",
        description: "Configure a autenticação biométrica nas configurações de segurança.",
        variant: "destructive",
      });
      onClose();
      return;
    }

    setIsAuthenticating(true);
    setAuthResult('pending');

    try {
      const result = await biometricAuth.authenticate({
        title: title,
        subtitle: description,
        description: `Use sua biometria para confirmar ${operation}`,
        fallbackButtonTitle: "Usar senha"
      });

      if (result.success) {
        setAuthResult('success');
        toast({
          title: "Autenticação bem-sucedida!",
          description: "Operação confirmada com sucesso.",
        });
        
        // Aguardar um momento para mostrar o sucesso
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      } else {
        setAuthResult('error');
        toast({
          title: "Falha na autenticação",
          description: result.error || "Não foi possível autenticar. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setAuthResult('error');
      toast({
        title: "Erro na autenticação",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleFallback = () => {
    onClose();
    if (onFallback) {
      onFallback();
    }
  };

  const getBiometricIcon = () => {
    switch (biometricAuth.biometricType) {
      case 'fingerprint':
        return <Fingerprint className="w-12 h-12" />;
      case 'face':
        return <Eye className="w-12 h-12" />;
      default:
        return <Fingerprint className="w-12 h-12" />;
    }
  };

  const getBiometricText = () => {
    switch (biometricAuth.biometricType) {
      case 'fingerprint':
        return 'Toque no sensor de digital';
      case 'face':
        return 'Olhe para a câmera';
      default:
        return 'Use sua biometria';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {/* Biometric Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/20">
            {authResult === 'pending' && isAuthenticating && (
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            )}
            {authResult === 'success' && (
              <CheckCircle className="w-10 h-10 text-green-500" />
            )}
            {authResult === 'error' && (
              <XCircle className="w-10 h-10 text-red-500" />
            )}
            {authResult === 'pending' && !isAuthenticating && (
              getBiometricIcon()
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center mb-6">
          {authResult === 'pending' && isAuthenticating && (
            <div className="space-y-2">
              <p className="text-foreground font-medium">Autenticando...</p>
              <p className="text-muted-foreground text-sm">{getBiometricText()}</p>
            </div>
          )}
          {authResult === 'pending' && !isAuthenticating && (
            <div className="space-y-2">
              <p className="text-foreground font-medium">Aguardando autenticação</p>
              <p className="text-muted-foreground text-sm">{getBiometricText()}</p>
            </div>
          )}
          {authResult === 'success' && (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">Autenticação bem-sucedida!</p>
              <p className="text-muted-foreground text-sm">Operação confirmada</p>
            </div>
          )}
          {authResult === 'error' && (
            <div className="space-y-2">
              <p className="text-red-600 font-medium">Falha na autenticação</p>
              <p className="text-muted-foreground text-sm">Tente novamente ou use senha</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {authResult === 'error' && (
            <Button
              onClick={handleBiometricAuth}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Tentando novamente...
                </>
              ) : (
                "Tentar Novamente"
              )}
            </Button>
          )}

          {onFallback && (
            <Button
              variant="outline"
              onClick={handleFallback}
              className="w-full border-border hover:bg-card"
              disabled={isAuthenticating}
            >
              Usar Senha
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-muted-foreground hover:text-foreground"
            disabled={isAuthenticating}
          >
            Cancelar
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Esta operação requer autenticação biométrica para garantir a segurança da sua conta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricAuthModal;
