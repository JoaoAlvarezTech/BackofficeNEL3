import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/contexts/BalanceContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft,
  HelpCircle,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  QrCode
} from "lucide-react";
import { useState, useEffect } from "react";

const PixSenha = () => {
  const { logout } = useAuth();
  const { simulatePixTransfer } = useBalance();
  const navigate = useNavigate();
  const location = useLocation();
  const transferData = location.state || {};

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);

  const maxAttempts = 3;
  const blockDuration = 30; // segundos

  // Simulação de senha correta (em produção seria validada no backend)
  const correctPassword = "1234";

  const handleNumberClick = (num: string) => {
    if (isBlocked) return;
    
    if (num === "backspace") {
      setPassword(prev => prev.slice(0, -1));
    } else if (password.length < 4) {
      setPassword(prev => prev + num);
    }
  };

  const handleConfirm = async () => {
    if (password.length !== 4) return;

    if (password === correctPassword) {
      // Senha correta - simular transferência PIX
      const success = await simulatePixTransfer(transferData.amount, transferData.recipientInfo?.name || 'Destinatário');
      if (success) {
        navigate('/pix/sucesso', { state: transferData });
      } else {
        // Saldo insuficiente
        alert('Saldo insuficiente para realizar a transferência.');
      }
    } else {
      // Senha incorreta
      setAttempts(prev => prev + 1);
      setPassword("");
      
      if (attempts + 1 >= maxAttempts) {
        setIsBlocked(true);
        setBlockTime(blockDuration);
      }
    }
  };

  // Timer para desbloquear
  useEffect(() => {
    if (isBlocked && blockTime > 0) {
      const timer = setTimeout(() => {
        setBlockTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isBlocked && blockTime === 0) {
      setIsBlocked(false);
      setAttempts(0);
    }
  }, [isBlocked, blockTime]);

  const getPasswordStrength = () => {
    if (password.length === 0) return "empty";
    if (password.length < 4) return "weak";
    return "complete";
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/pix/confirmar')}
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
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Senha de confirmação</h1>
          <p className="text-muted-foreground mb-6">Digite sua senha de 4 dígitos</p>
          
          {/* Alert de segurança */}
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Sua senha é segura</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Nunca compartilhe sua senha com ninguém
                </p>
              </div>
            </div>
          </div>

          {/* Campo de senha */}
          <div className="mb-8">
            <div className="relative">
              <div className="flex justify-center gap-4 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                      index < password.length
                        ? showPassword 
                          ? 'bg-primary border-primary text-primary-foreground flex items-center justify-center text-xs font-bold'
                          : 'bg-card-foreground border-card-foreground'
                        : 'border-border/30'
                    }`}
                  >
                    {showPassword && index < password.length && password[index]}
                  </div>
                ))}
              </div>
              
              {/* Toggle para mostrar/ocultar senha */}
              <div className="flex justify-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Ocultar senha
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Mostrar senha
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Status da senha */}
            <div className="text-center">
              {passwordStrength === "complete" && (
                <p className="text-sm text-primary">Senha completa</p>
              )}
              {attempts > 0 && (
                <p className="text-sm text-destructive">
                  Senha incorreta. Tentativas restantes: {maxAttempts - attempts}
                </p>
              )}
              {isBlocked && (
                <div className="flex items-center justify-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Conta bloqueada por {blockTime}s</span>
                </div>
              )}
            </div>
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="outline"
                className={`h-16 text-xl font-medium transition-all duration-300 ${
                  isBlocked 
                    ? 'border-border/10 text-muted-foreground cursor-not-allowed' 
                    : 'border-border/30 hover:bg-card/60 text-card-foreground'
                }`}
                onClick={() => handleNumberClick(num.toString())}
                disabled={isBlocked}
              >
                {num}
              </Button>
            ))}
            <div className="h-16"></div>
            <Button
              variant="outline"
              className={`h-16 text-xl font-medium transition-all duration-300 ${
                isBlocked 
                  ? 'border-border/10 text-muted-foreground cursor-not-allowed' 
                  : 'border-border/30 hover:bg-card/60 text-card-foreground'
              }`}
              onClick={() => handleNumberClick("0")}
              disabled={isBlocked}
            >
              0
            </Button>
            <Button
              variant="outline"
              className={`h-16 text-xl font-medium transition-all duration-300 ${
                isBlocked 
                  ? 'border-border/10 text-muted-foreground cursor-not-allowed' 
                  : 'border-border/30 hover:bg-card/60 text-card-foreground'
              }`}
              onClick={() => handleNumberClick("backspace")}
              disabled={isBlocked}
            >
              ←
            </Button>
          </div>

          <Button 
            className={`w-full py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
              password.length === 4 && !isBlocked
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            onClick={handleConfirm}
            disabled={password.length !== 4 || isBlocked}
          >
            {isBlocked ? `Aguarde ${blockTime}s` : 'Confirmar'}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Esqueceu sua senha? Entre em contato com o suporte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixSenha;
