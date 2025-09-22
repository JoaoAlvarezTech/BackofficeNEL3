
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/contexts/BalanceContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Scan,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Check,
  AlertCircle,
  Copy,
  Download,
  QrCode,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Wallet
} from "lucide-react";
import { useState } from "react";

interface BoletoData {
  beneficiario: string;
  cnpj: string;
  valor: number;
  vencimento: string;
  codigoBarras: string;
  linhaDigitavel: string;
  nossoNumero: string;
  documento: string;
  multa: number;
  juros: number;
  desconto: number;
}

const Boleto = () => {
  const { user } = useAuth();
  const { balance, simulateBoletoPayment } = useBalance();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [boletoCode, setBoletoCode] = useState('');
  const [boletoData, setBoletoData] = useState<BoletoData | null>(null);
  const [step, setStep] = useState<'input' | 'confirm' | 'password' | 'success'>('input');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulação de dados do boleto
  const simulateBoletoData = (code: string) => {
    return {
      beneficiario: "HOSPITAL SÃO LUCAS LTDA",
      cnpj: "12.345.678/0001-90",
      valor: 1250.00,
      vencimento: "15/03/2025",
      codigoBarras: code,
      linhaDigitavel: "23793.38128 60000.633434 36000.633401 8 84410026000012500",
      nossoNumero: "000000012345",
      documento: "FAT-2025-001",
      multa: 0,
      juros: 0,
      desconto: 0
    };
  };

  const handleScanBoleto = () => {
    // Simulação de leitura de código de barras
    const simulatedCode = "23793381286000063343436000633401884410026000012500";
    setBoletoCode(simulatedCode);
    setBoletoData(simulateBoletoData(simulatedCode));
    setStep('confirm');
  };

  const handleManualInput = () => {
    if (boletoCode.length >= 44) {
      setBoletoData(simulateBoletoData(boletoCode));
      setStep('confirm');
    }
  };

  const handleConfirmPayment = () => {
    setStep('password');
  };

  const handleNumberClick = (num: string) => {
    if (isBlocked) return;
    
    if (num === "backspace") {
      setPassword(prev => prev.slice(0, -1));
    } else if (password.length < 4) {
      setPassword(prev => prev + num);
    }
  };

  const handlePasswordSubmit = async () => {
    // Simulação de validação de senha (senha correta: 1234)
    if (password === '1234') {
      setIsProcessing(true);
      
      try {
        // Verificar se há saldo suficiente
        if (boletoData && balance < boletoData.valor) {
          alert('Saldo insuficiente para realizar o pagamento!');
          setPassword('');
          setPasswordAttempts(0);
          setIsProcessing(false);
          return;
        }

        // Processar pagamento do boleto
        if (boletoData) {
          const success = await simulateBoletoPayment(
            boletoData.valor,
            boletoData.beneficiario,
            boletoData.documento
          );

          if (success) {
            setStep('success');
            setPassword('');
            setPasswordAttempts(0);
          } else {
            alert('Erro ao processar pagamento. Tente novamente.');
          }
        }
      } catch (error) {
        alert('Erro ao processar pagamento. Tente novamente.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      const newAttempts = passwordAttempts + 1;
      setPasswordAttempts(newAttempts);
      setPassword('');
      
      if (newAttempts >= 3) {
        setIsBlocked(true);
        setBlockTime(30); // 30 segundos
        const interval = setInterval(() => {
          setBlockTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsBlocked(false);
              setPasswordAttempts(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const formatDate = (date: string) => {
    return new Date(date.split('/').reverse().join('-')).toLocaleDateString('pt-BR');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border/30 rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="bg-primary p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-primary-foreground font-semibold">Boleto Pago</span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Check className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-card-foreground mb-2">Boleto Pago com Sucesso!</h1>
                <p className="text-2xl font-bold text-card-foreground">
                  {formatCurrency(boletoData?.valor || 0)}
                </p>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Código de Transação</span>
                  <span className="text-sm font-mono text-card-foreground font-medium">
                    BOL{Date.now().toString().slice(-8)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data e Hora</span>
                  <span className="text-sm text-card-foreground">
                    {new Date().toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                      <Building className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-card-foreground">BENEFICIÁRIO</h3>
                  </div>
                  <p className="text-sm text-card-foreground font-medium">{boletoData?.beneficiario}</p>
                  <p className="text-xs text-muted-foreground">CNPJ: {boletoData?.cnpj}</p>
                </div>

                <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-card-foreground">PAGADOR</h3>
                  </div>
                  <p className="text-sm text-card-foreground font-medium">João Vitor Alvarez Teixeira</p>
                  <p className="text-xs text-muted-foreground">CPF: 123.456.789-0</p>
                  <p className="text-xs text-muted-foreground">AG 0001 C/C 123456-7</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium rounded-xl transition-all duration-300">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Comprovante
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="py-3 border-border/30 hover:bg-card/60 transition-all duration-300">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                  <Button variant="outline" className="py-3 border-border/30 hover:bg-card/60 transition-all duration-300" onClick={() => navigate('/dashboard')}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Novo Boleto
                  </Button>
                </div>

                <Button variant="ghost" className="w-full text-primary hover:text-primary/80 transition-all duration-300" onClick={() => navigate('/dashboard')}>
                  Voltar ao Início
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setStep('confirm')}
              className="p-2 hover:bg-card transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-foreground text-base font-semibold block">Pagar Boleto</span>
                <span className="text-muted-foreground text-xs">Pagamento seguro</span>
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
                {password.length === 4 && (
                  <p className="text-sm text-primary">Senha completa</p>
                )}
                {passwordAttempts > 0 && (
                  <p className="text-sm text-destructive">
                    Senha incorreta. Tentativas restantes: {3 - passwordAttempts}
                  </p>
                )}
                {isBlocked && (
                  <div className="flex items-center justify-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
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
                    isBlocked || isProcessing
                      ? 'border-border/10 text-muted-foreground cursor-not-allowed' 
                      : 'border-border/30 hover:bg-card/60 text-card-foreground'
                  }`}
                  onClick={() => handleNumberClick(num.toString())}
                  disabled={isBlocked || isProcessing}
                >
                  {num}
                </Button>
              ))}
              <div className="h-16"></div>
              <Button
                variant="outline"
                className={`h-16 text-xl font-medium transition-all duration-300 ${
                  isBlocked || isProcessing
                    ? 'border-border/10 text-muted-foreground cursor-not-allowed' 
                    : 'border-border/30 hover:bg-card/60 text-card-foreground'
                }`}
                onClick={() => handleNumberClick("0")}
                disabled={isBlocked || isProcessing}
              >
                0
              </Button>
              <Button
                variant="outline"
                className={`h-16 text-xl font-medium transition-all duration-300 ${
                  isBlocked || isProcessing
                    ? 'border-border/10 text-muted-foreground cursor-not-allowed' 
                    : 'border-border/30 hover:bg-card/60 text-card-foreground'
                }`}
                onClick={() => handleNumberClick("backspace")}
                disabled={isBlocked || isProcessing}
              >
                ←
              </Button>
            </div>

            <Button 
              className={`w-full py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
                password.length === 4 && !isBlocked && !isProcessing
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              onClick={handlePasswordSubmit}
              disabled={password.length !== 4 || isBlocked || isProcessing}
            >
              {isProcessing ? 'Processando...' : isBlocked ? `Aguarde ${blockTime}s` : 'Confirmar'}
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
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setStep('input')}
            className="text-foreground hover:bg-card/60"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Confirmar Pagamento</h1>
          <div className="w-10"></div>
        </header>

        <div className="px-4 py-6 pb-28 space-y-6">
          <div className="max-w-md mx-auto">
            {/* Saldo atual */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">Saldo Atual</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>

            <div className="bg-card border border-border/30 rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-card-foreground">Dados do Boleto</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Building className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold text-card-foreground">BENEFICIÁRIO</h3>
                  </div>
                  <p className="text-sm text-card-foreground font-medium">{boletoData?.beneficiario}</p>
                  <p className="text-xs text-muted-foreground">CNPJ: {boletoData?.cnpj}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">VALOR</span>
                    </div>
                    <p className="text-lg font-bold text-card-foreground">{formatCurrency(boletoData?.valor || 0)}</p>
                  </div>

                  <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">VENCIMENTO</span>
                    </div>
                    <p className="text-lg font-bold text-card-foreground">{boletoData?.vencimento}</p>
                  </div>
                </div>

                <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-card-foreground mb-2">DOCUMENTO</h3>
                  <p className="text-sm text-card-foreground">{boletoData?.documento}</p>
                </div>

                {/* Verificação de saldo */}
                {boletoData && balance < boletoData.valor && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Saldo Insuficiente</span>
                    </div>
                    <p className="text-xs text-red-700">
                      Saldo atual: {formatCurrency(balance)} | Valor necessário: {formatCurrency(boletoData.valor)}
                    </p>
                  </div>
                )}

                {boletoData?.multa > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Boleto Vencido</span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Multa: {formatCurrency(boletoData.multa)} | Juros: {formatCurrency(boletoData.juros)}
                    </p>
                  </div>
                )}

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-card-foreground">Pagamento instantâneo</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        O valor será debitado imediatamente da sua conta
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  className={`w-full py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
                    boletoData && balance >= boletoData.valor
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                  onClick={handleConfirmPayment}
                  disabled={!boletoData || balance < boletoData.valor}
                >
                  Continuar
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full py-3 border-border/30 hover:bg-card/60 transition-all duration-300"
                  onClick={() => setStep('input')}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="text-foreground hover:bg-card/60"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Pagar Boleto</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-4 py-6 pb-28 space-y-6">
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border/30 rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-card-foreground">Pagar Boleto</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Escaneie ou digite o código do boleto
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-muted/20 rounded-xl p-1 mb-6">
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'scan'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('scan')}
              >
                <Camera className="w-4 h-4" />
                Escanear
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'manual'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('manual')}
              >
                <FileText className="w-4 h-4" />
                Digitar
              </button>
            </div>

            {activeTab === 'scan' ? (
              <div className="space-y-6">
                <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scan className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    Escanear Código de Barras
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Posicione o código de barras do boleto dentro da área de leitura
                  </p>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium rounded-xl transition-all duration-300"
                    onClick={handleScanBoleto}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Iniciar Escaneamento
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Ou <button 
                      className="text-primary hover:text-primary/80 font-medium"
                      onClick={() => setActiveTab('manual')}
                    >
                      digite o código manualmente
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Código de Barras ou Linha Digitável
                  </label>
                  <div className="relative">
                    <Input
                      value={boletoCode}
                      onChange={(e) => setBoletoCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Digite o código do boleto"
                      className="w-full py-4 text-lg border-2 border-border/30 rounded-xl focus:border-primary focus:ring-0 bg-card"
                      maxLength={47}
                    />
                    {boletoCode && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setBoletoCode('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                      >
                        <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-45" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Digite apenas os números (máximo 47 dígitos)
                  </p>
                </div>

                <Button 
                  className={`w-full py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
                    boletoCode.length >= 44
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                  onClick={handleManualInput}
                  disabled={boletoCode.length < 44}
                >
                  Continuar
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Ou <button 
                      className="text-primary hover:text-primary/80 font-medium"
                      onClick={() => setActiveTab('scan')}
                    >
                      escaneie o código de barras
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-card-foreground mb-1">
                  Dicas para pagamento seguro
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Verifique sempre os dados do beneficiário</li>
                  <li>• Confirme o valor e data de vencimento</li>
                  <li>• Mantenha o comprovante de pagamento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boleto;
