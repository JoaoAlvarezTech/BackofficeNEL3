import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/contexts/BalanceContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft,
  HelpCircle,
  Edit3,
  User,
  Mail,
  Smartphone,
  CreditCard,
  Shield,
  Clock,
  AlertCircle,
  QrCode,
  Fingerprint
} from "lucide-react";
import { useState } from "react";
import BiometricAuthModal from "@/components/BiometricAuthModal";

const PixConfirmar = () => {
  const { logout, biometricAuth } = useAuth();
  const { simulatePixTransfer, balance } = useBalance();
  const navigate = useNavigate();
  const location = useLocation();
  const { pixKey, amount } = location.state || {};

  const [description, setDescription] = useState("");
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  // Simulação de dados do destinatário baseado na chave PIX
  const getRecipientInfo = (key: string) => {
    if (key.includes('@')) {
      return {
        name: "Maria Silva",
        document: "***.xxx.xxx-**",
        key: key,
        type: "E-mail",
        bank: "Banco do Brasil",
        account: "AG 0001 C/C 123456-7"
      };
    } else if (key.includes('.')) {
      return {
        name: "João Santos",
        document: key,
        key: key,
        type: "CPF",
        bank: "Itaú",
        account: "AG 1234 C/C 567890-1"
      };
    } else {
      return {
        name: "Paulo Ricardo Da Silva",
        document: "***.xxx.xxx-**",
        key: key,
        type: "Celular",
        bank: "Nubank",
        account: "AG 0001 C/C 123456-7"
      };
    }
  };

  const recipientInfo = getRecipientInfo(pixKey || "11971981463");
  const transferAmount = amount || 125.00;

  const getKeyTypeIcon = (type: string) => {
    switch (type) {
      case "E-mail": return Mail;
      case "CPF": return User;
      case "Celular": return Smartphone;
      default: return CreditCard;
    }
  };

  const KeyIcon = getKeyTypeIcon(recipientInfo.type);

  const handleContinue = () => {
    // Verificar se a biometria está disponível e habilitada
    if (biometricAuth.isAvailable && biometricAuth.isBiometricEnabledForUser()) {
      setShowBiometricModal(true);
    } else {
      // Fallback para senha tradicional
      navigate('/pix/senha', { 
        state: { 
          pixKey,
          amount: transferAmount,
          recipientInfo,
          description
        } 
      });
    }
  };

  const handleBiometricSuccess = async () => {
    // Simular transferência PIX
    const success = await simulatePixTransfer(transferAmount, recipientInfo.name);
    if (success) {
      navigate('/pix/sucesso', { 
        state: { 
          pixKey,
          amount: transferAmount,
          recipientInfo,
          description
        } 
      });
    } else {
      // Saldo insuficiente
      alert('Saldo insuficiente para realizar a transferência.');
    }
  };

  const handleBiometricFallback = () => {
    // Fallback para senha tradicional
    navigate('/pix/senha', { 
      state: { 
        pixKey,
        amount: transferAmount,
        recipientInfo,
        description
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/pix/valor')}
            className="p-2 hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-foreground text-base font-semibold block">Transferir com Pix</span>
              <span className="text-muted-foreground text-xs">Pagamentos instantâneos</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-primary text-xl font-bold tracking-tight">
            NEL<sup className="text-sm">3</sup><span className="text-destructive">+</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 pb-28 space-y-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Confirme as informações</h1>
          <p className="text-muted-foreground mb-6">Verifique os dados antes de continuar</p>
          
          {/* Alert de segurança */}
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Transferência segura</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sua transferência será processada com criptografia de ponta a ponta
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {/* Valor */}
            <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-lg font-semibold text-card-foreground">
                  R$ {transferAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-card/80 transition-colors"
                onClick={() => navigate('/pix/valor', { state: { pixKey } })}
              >
                <Edit3 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Destinatário */}
            <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destinatário</p>
                  <p className="text-lg font-semibold text-card-foreground">{recipientInfo.name}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-card/80 transition-colors">
                <Edit3 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Documento */}
            <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
              <div>
                <p className="text-sm text-muted-foreground">Documento</p>
                <p className="text-lg font-semibold text-card-foreground">{recipientInfo.document}</p>
              </div>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-card/80 transition-colors">
                <Edit3 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Chave PIX */}
            <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                  <KeyIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chave PIX</p>
                  <p className="text-lg font-semibold text-card-foreground">{recipientInfo.key}</p>
                  <p className="text-xs text-muted-foreground">{recipientInfo.type}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-card/80 transition-colors">
                <Edit3 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Banco */}
            <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
              <div>
                <p className="text-sm text-muted-foreground">Banco</p>
                <p className="text-lg font-semibold text-card-foreground">{recipientInfo.bank}</p>
                <p className="text-xs text-muted-foreground">{recipientInfo.account}</p>
              </div>
            </div>

            {/* Quando */}
            <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quando</p>
                  <p className="text-lg font-semibold text-card-foreground">Agora</p>
                  <p className="text-xs text-primary">Transferência instantânea</p>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="mb-6">
            {showDescriptionInput ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Digite uma descrição (opcional)"
                  className="w-full p-3 border border-border/30 rounded-xl focus:border-primary focus:ring-0 bg-card"
                  maxLength={50}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDescriptionInput(false)}
                    className="flex-1 border-border/30 hover:bg-card/60"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowDescriptionInput(false)}
                    className="flex-1"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary/80 p-0 h-auto"
                onClick={() => setShowDescriptionInput(true)}
              >
                {description ? `Descrição: ${description}` : "Adicionar uma descrição"}
              </Button>
            )}
          </div>

          {/* Botão de continuar com ícone de biometria se disponível */}
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            onClick={handleContinue}
          >
            {biometricAuth.isAvailable && biometricAuth.isBiometricEnabledForUser() && (
              <Fingerprint className="w-5 h-5" />
            )}
            Continuar
          </Button>

          {/* Indicador de segurança biométrica */}
          {biometricAuth.isAvailable && biometricAuth.isBiometricEnabledForUser() && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700">
                  Autenticação biométrica será solicitada para confirmar a transferência
                </span>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Ao continuar, você concorda com os termos de uso
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Autenticação Biométrica */}
      <BiometricAuthModal
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onSuccess={handleBiometricSuccess}
        onFallback={handleBiometricFallback}
        title="Confirmar Transferência PIX"
        description="Confirme sua identidade para finalizar a transferência"
        operation="a transferência PIX"
      />
    </div>
  );
};

export default PixConfirmar;
