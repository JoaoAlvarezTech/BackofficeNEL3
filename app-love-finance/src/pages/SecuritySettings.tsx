import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Fingerprint,
  Eye,
  Shield,
  Lock,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const SecuritySettings = () => {
  const { biometricAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<{
    available: boolean;
    enabled: boolean;
    type: string;
  }>({
    available: false,
    enabled: false,
    type: 'none'
  });

  useEffect(() => {
    checkBiometricStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkBiometricStatus = async () => {
    const available = await biometricAuth.checkAvailability();
    const enabled = biometricAuth.isBiometricEnabledForUser();
    const type = biometricAuth.biometricType;
    
    setBiometricStatus({
      available,
      enabled,
      type
    });
  };

  const handleEnableBiometric = async () => {
    setIsLoading(true);
    
    try {
      const success = await biometricAuth.enableBiometric();
      
      if (success) {
        toast({
          title: "Biometria habilitada!",
          description: "Agora você pode fazer login usando sua biometria.",
        });
        setBiometricStatus(prev => ({ ...prev, enabled: true }));
      } else {
        toast({
          title: "Erro ao habilitar biometria",
          description: "Não foi possível habilitar a autenticação biométrica.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao habilitar biometria",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableBiometric = () => {
    biometricAuth.disableBiometric();
    setBiometricStatus(prev => ({ ...prev, enabled: false }));
    
    toast({
      title: "Biometria desabilitada",
      description: "A autenticação biométrica foi desabilitada.",
    });
  };

  const getBiometricIcon = () => {
    switch (biometricStatus.type) {
      case 'fingerprint':
        return <Fingerprint className="w-6 h-6" />;
      case 'face':
        return <Eye className="w-6 h-6" />;
      default:
        return <Fingerprint className="w-6 h-6" />;
    }
  };

  const getBiometricTitle = () => {
    switch (biometricStatus.type) {
      case 'fingerprint':
        return 'Digital';
      case 'face':
        return 'Face ID';
      default:
        return 'Biometria';
    }
  };

  const getBiometricDescription = () => {
    switch (biometricStatus.type) {
      case 'fingerprint':
        return 'Use sua impressão digital para fazer login';
      case 'face':
        return 'Use seu rosto para fazer login';
      default:
        return 'Autenticação biométrica';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Configurações de Segurança</span>
            <span className="text-muted-foreground text-xs">Gerencie a segurança da sua conta</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Biometric Authentication Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Autenticação Biométrica
          </h2>

          {/* Biometric Status Card */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                {getBiometricIcon()}
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-medium">{getBiometricTitle()}</h3>
                <p className="text-muted-foreground text-sm">{getBiometricDescription()}</p>
              </div>
              <div className="flex items-center gap-2">
                {biometricStatus.available ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  biometricStatus.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  {biometricStatus.available ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className={`text-sm font-medium ${
                  biometricStatus.enabled ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {biometricStatus.enabled ? 'Habilitado' : 'Desabilitado'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {biometricStatus.available && (
              <div className="flex gap-3">
                {!biometricStatus.enabled ? (
                  <Button
                    onClick={handleEnableBiometric}
                    disabled={isLoading}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isLoading ? "Habilitando..." : "Habilitar Biometria"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleDisableBiometric}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                  >
                    Desabilitar Biometria
                  </Button>
                )}
              </div>
            )}

            {/* Not Available Message */}
            {!biometricStatus.available && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-800">
                    A autenticação biométrica não está disponível no seu dispositivo.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Tips */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Dicas de Segurança
          </h2>

          <div className="space-y-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <h4 className="text-foreground font-medium text-sm">Mantenha seu dispositivo atualizado</h4>
                  <p className="text-muted-foreground text-xs mt-1">
                    Atualizações de segurança protegem contra vulnerabilidades.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <h4 className="text-foreground font-medium text-sm">Use senhas fortes</h4>
                  <p className="text-muted-foreground text-xs mt-1">
                    Combine letras, números e símbolos para maior segurança.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <h4 className="text-foreground font-medium text-sm">Ative a autenticação biométrica</h4>
                  <p className="text-muted-foreground text-xs mt-1">
                    A biometria oferece uma camada extra de segurança.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Informações do Dispositivo
          </h2>

          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tipo de Biometria:</span>
              <span className="text-sm font-medium text-foreground">
                {biometricStatus.type === 'none' ? 'Não disponível' : getBiometricTitle()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className={`text-sm font-medium ${
                biometricStatus.available ? 'text-green-600' : 'text-red-600'
              }`}>
                {biometricStatus.available ? 'Disponível' : 'Indisponível'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Configurado:</span>
              <span className={`text-sm font-medium ${
                biometricStatus.enabled ? 'text-green-600' : 'text-orange-600'
              }`}>
                {biometricStatus.enabled ? 'Sim' : 'Não'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
