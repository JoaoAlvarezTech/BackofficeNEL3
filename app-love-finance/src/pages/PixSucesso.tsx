import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  X,
  Check,
  Download,
  Copy,
  QrCode,
  Shield,
  ArrowRight,
  User,
  Wallet
} from "lucide-react";
import { useState } from "react";

const PixSucesso = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const transferData = location.state || {};

  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dados da transferência (usando dados do estado ou valores padrão)
  const {
    amount = 9876.99,
    recipientInfo = {
      name: "Paulo Ricardo Da Silva",
      document: "***.xxx.xxx-**",
      bank: "Nubank",
      account: "AG 0001 C/C 123456-7"
    },
    description = ""
  } = transferData;

  const transactionId = `PIX${Date.now().toString().slice(-8)}`;
  const transactionDate = new Date().toLocaleString('pt-BR');

  const handleCopyReceipt = async () => {
    const receiptText = `
COMPROVANTE DE TRANSFERÊNCIA PIX

ID da Transação: ${transactionId}
Data: ${transactionDate}
Valor: R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

ORIGEM:
João Vitor Alvarez Teixeira
CPF: 123.456.789-0
AG 0001 C/C 123456-7

DESTINO:
${recipientInfo.name}
CPF: ${recipientInfo.document}
${recipientInfo.bank} - ${recipientInfo.account}

${description ? `Descrição: ${description}` : ''}

Transferência processada com sucesso.
    `.trim();

    try {
      await navigator.clipboard.writeText(receiptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptText = `
COMPROVANTE DE TRANSFERÊNCIA PIX

ID da Transação: ${transactionId}
Data: ${transactionDate}
Valor: R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

ORIGEM:
João Vitor Alvarez Teixeira
CPF: 123.456.789-0
AG 0001 C/C 123456-7

DESTINO:
${recipientInfo.name}
CPF: ${recipientInfo.document}
${recipientInfo.bank} - ${recipientInfo.account}

${description ? `Descrição: ${description}` : ''}

Transferência processada com sucesso.
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante-pix-${transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-card border border-border/30 rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
          {/* Header */}
          <div className="bg-primary p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground font-semibold">Comprovante PIX</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/pix')}
              className="text-primary-foreground hover:bg-primary-foreground/20 p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Success Icon and Amount */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-card-foreground mb-2">Transferência Realizada!</h1>
              <p className="text-2xl font-bold text-card-foreground">
                R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Transaction Info Card */}
            <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">ID da Transação</span>
                <span className="text-sm font-mono text-card-foreground font-medium">{transactionId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data e Hora</span>
                <span className="text-sm text-card-foreground">{transactionDate}</span>
              </div>
            </div>

            {/* Origin and Destination */}
            <div className="space-y-3">
              {/* Origin */}
              <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <Wallet className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground">ORIGEM</h3>
                </div>
                <p className="text-sm text-card-foreground font-medium">João Vitor Alvarez Teixeira</p>
                <p className="text-xs text-muted-foreground">CPF: 123.456.789-0</p>
                <p className="text-xs text-muted-foreground">AG 0001 C/C 123456-7</p>
              </div>

              {/* Destination */}
              <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground">DESTINO</h3>
                </div>
                <p className="text-sm text-card-foreground font-medium">{recipientInfo.name}</p>
                <p className="text-xs text-muted-foreground">CPF: {recipientInfo.document}</p>
                <p className="text-xs text-muted-foreground">{recipientInfo.bank} - {recipientInfo.account}</p>
              </div>

              {/* Description (if exists) */}
              {description && (
                <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-card-foreground mb-2">DESCRIÇÃO</h3>
                  <p className="text-sm text-card-foreground">{description}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium rounded-xl transition-all duration-300"
                onClick={handleCopyReceipt}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copiado!' : 'Copiar Comprovante'}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="py-3 border-border/30 hover:bg-card/60 transition-all duration-300"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
                <Button
                  variant="outline"
                  className="py-3 border-border/30 hover:bg-card/60 transition-all duration-300"
                  onClick={() => setShowQRCode(!showQRCode)}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full text-primary hover:text-primary/80 transition-all duration-300"
                onClick={() => navigate('/pix')}
              >
                Nova Transferência
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Security Note */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-card-foreground">Transferência segura</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Processada com criptografia de ponta a ponta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixSucesso;
