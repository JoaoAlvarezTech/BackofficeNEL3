import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft,
  QrCode,
  Download,
  Copy,
  Share2,
  Clock,
  RefreshCw,
  User,
  Smartphone,
  Mail,
  CreditCard,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";

const PixQrCode = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { amount = 125.00, description = "" } = location.state || {};

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos em segundos
  const [selectedKey, setSelectedKey] = useState(0);

  // Dados simulados das chaves PIX
  const pixKeys = [
    { type: "Celular", value: "11971981463", icon: Smartphone },
    { type: "E-mail", value: "joao.alvarez@email.com", icon: Mail },
    { type: "CPF", value: "123.456.789-00", icon: User },
    { type: "Chave aleatória", value: "pix-12345678", icon: CreditCard }
  ];

  const currentKey = pixKeys[selectedKey];

  // Timer para expiração do QR Code
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(currentKey.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Receber PIX',
          text: `Receba R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} via PIX`,
          url: currentKey.value
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para copiar
      handleCopyKey();
    }
  };

  const handleRefresh = () => {
    setTimeLeft(1800); // Reset para 30 minutos
  };

  const handleDownloadQR = () => {
    // Simulação de download do QR Code
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Desenhar um QR Code simples (em produção seria uma biblioteca real)
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#fff';
      ctx.fillRect(10, 10, 180, 180);
      ctx.fillStyle = '#000';
      ctx.fillRect(20, 20, 160, 160);
    }
    
    const link = document.createElement('a');
    link.download = `qrcode-pix-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSimulatePayment = () => {
    // Simular dados do pagador
    const payerInfo = {
      name: "Maria Silva",
      document: "***.xxx.xxx-**",
      bank: "Itaú",
      account: "AG 1234 C/C 567890-1"
    };

    navigate('/pix/recebido', { 
      state: { 
        amount,
        description,
        payerInfo
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
            onClick={() => navigate('/pix/receber')}
            className="p-2 hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-foreground text-base font-semibold block">Receber PIX</span>
              <span className="text-muted-foreground text-xs">QR Code para pagamento</span>
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
          {/* Timer */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Válido por</span>
            </div>
            <div className="text-2xl font-bold text-card-foreground">
              {formatTime(timeLeft)}
            </div>
            {timeLeft === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-2 border-border/30 hover:bg-card/60"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Renovar
              </Button>
            )}
          </div>

          {/* QR Code */}
          <div className="bg-card border border-border/30 rounded-2xl p-8 text-center mb-6">
            <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center border border-border/30">
              <QrCode className="w-32 h-32 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-card-foreground mb-2">
              R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            {description && (
              <p className="text-sm text-muted-foreground mb-4">{description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Apresente este QR Code para receber o pagamento
            </p>
          </div>

          {/* Chave PIX Selecionada */}
          <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                  <currentKey.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{currentKey.type}</p>
                  <p className="text-xs text-muted-foreground">{currentKey.value}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyKey}
                className="text-muted-foreground hover:text-card-foreground"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-primary text-center">Chave copiada!</p>
            )}
          </div>

          {/* Outras Chaves */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-card-foreground mb-3">Outras chaves PIX</h3>
            <div className="space-y-2">
              {pixKeys.map((key, index) => (
                index !== selectedKey && (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedKey(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                        <key.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{key.type}</p>
                        <p className="text-xs text-muted-foreground">{key.value}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(key.value);
                      }}
                      className="text-muted-foreground hover:text-card-foreground"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium rounded-xl transition-all duration-300"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="py-3 border-border/30 hover:bg-card/60 transition-all duration-300"
                onClick={handleDownloadQR}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar QR
              </Button>
              <Button
                variant="outline"
                className="py-3 border-border/30 hover:bg-card/60 transition-all duration-300"
                onClick={handleCopyKey}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Chave
              </Button>
            </div>

            {/* Botão para simular recebimento */}
            <Button
              variant="outline"
              className="w-full py-3 border-primary/30 hover:bg-primary/10 text-primary transition-all duration-300"
              onClick={handleSimulatePayment}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Simular Recebimento
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              O pagamento será creditado instantaneamente em sua conta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixQrCode;
