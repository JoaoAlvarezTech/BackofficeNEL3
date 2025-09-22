import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/contexts/BalanceContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft,
  HelpCircle,
  X,
  AlertCircle,
  CheckCircle,
  QrCode
} from "lucide-react";
import { useState, useEffect } from "react";

const PixValor = () => {
  const { logout } = useAuth();
  const { balance } = useBalance();
  const navigate = useNavigate();
  const location = useLocation();
  const pixKey = location.state?.pixKey || "";

  const [amount, setAmount] = useState("0,00");
  const [isValid, setIsValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const quickAmounts = [10, 25, 50, 100, 200, 500];

  // Formatação de moeda brasileira
  const formatCurrency = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    
    if (numbers === '') return '0,00';
    
    // Converte para centavos
    const cents = parseInt(numbers);
    const reais = Math.floor(cents / 100);
    const centavos = cents % 100;
    
    return `${reais.toLocaleString('pt-BR')},${centavos.toString().padStart(2, '0')}`;
  };

  // Converte string formatada para número
  const parseAmount = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return parseInt(numbers) / 100;
  };

  const handleNumberClick = (num: string) => {
    if (num === "backspace") {
      const currentNumbers = amount.replace(/\D/g, '');
      if (currentNumbers.length > 1) {
        const newNumbers = currentNumbers.slice(0, -1);
        setAmount(formatCurrency(newNumbers));
      } else {
        setAmount("0,00");
      }
    } else if (num === ",") {
      // Vírgula é adicionada automaticamente
      return;
    } else {
      const currentNumbers = amount.replace(/\D/g, '');
      const newNumbers = currentNumbers + num;
      setAmount(formatCurrency(newNumbers));
    }
  };

  const clearAmount = () => {
    setAmount("0,00");
  };

  const selectQuickAmount = (value: number) => {
    setAmount(formatCurrency((value * 100).toString()));
  };

  useEffect(() => {
    const numericAmount = parseAmount(amount);
    const valid = numericAmount > 0 && numericAmount <= balance;
    setIsValid(valid);
    setShowError(numericAmount > balance);
  }, [amount, balance]);

  const handleContinue = () => {
    if (isValid) {
      navigate('/pix/confirmar', { 
        state: { 
          pixKey,
          amount: parseAmount(amount)
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/pix/enviar')}
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
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Valor a transferir</h1>
          <p className="text-muted-foreground mb-6">Digite o valor que deseja enviar</p>
          
          <div className="mb-6">
            <div className="relative">
              <div className={`text-4xl font-bold text-card-foreground p-6 border-2 rounded-xl text-center transition-all duration-300 ${
                showError ? 'border-destructive/30 bg-destructive/5' : 'border-border/30 bg-card'
              }`}>
                R$ {amount}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAmount}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
            
            {/* Status do saldo */}
            <div className="mt-3 flex items-center gap-2">
              {showError ? (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">Saldo insuficiente</p>
                </>
              ) : parseAmount(amount) > 0 ? (
                <>
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <p className="text-sm text-primary">Saldo disponível</p>
                </>
              ) : null}
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              Seu saldo atual é de R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Valores rápidos */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-card-foreground mb-3">Valores rápidos</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  className="py-3 text-sm font-medium border-border/30 hover:bg-card/60 transition-all duration-300"
                  onClick={() => selectQuickAmount(value)}
                >
                  R$ {value.toLocaleString('pt-BR')}
                </Button>
              ))}
            </div>
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="outline"
                className="h-16 text-xl font-medium border-border/30 hover:bg-card/60 transition-all duration-300"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              className="h-16 text-xl font-medium border-border/30 hover:bg-card/60 transition-all duration-300"
              onClick={() => handleNumberClick(",")}
            >
              ,
            </Button>
            <Button
              variant="outline"
              className="h-16 text-xl font-medium border-border/30 hover:bg-card/60 transition-all duration-300"
              onClick={() => handleNumberClick("0")}
            >
              0
            </Button>
            <Button
              variant="outline"
              className="h-16 text-xl font-medium border-border/30 hover:bg-card/60 transition-all duration-300"
              onClick={() => handleNumberClick("backspace")}
            >
              ←
            </Button>
          </div>

          <Button 
            className={`w-full py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
              isValid
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            onClick={handleContinue}
            disabled={!isValid}
          >
            Continuar
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Transferência instantânea • Sem taxas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixValor;
