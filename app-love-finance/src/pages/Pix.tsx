import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/contexts/BalanceContext";
import { usePixKeys } from "@/contexts/PixKeysContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Send,
  Download,
  QrCode,
  Copy,
  User,
  Wallet,
  Clock,
  Home,
  Calendar,
  Wallet as WalletIcon,
  FileText,
  Menu,
  Settings
} from "lucide-react";

const Pix = () => {
  const { logout } = useAuth();
  const { balance, transactions } = useBalance();
  const { getActivePixKeys } = usePixKeys();
  const navigate = useNavigate();
  const pixKeys = getActivePixKeys();

  // Filtrar apenas transações PIX e pegar as 3 mais recentes
  const recentTransactions = transactions
    .filter(t => t.type === 'pix_sent' || t.type === 'pix_received')
    .slice(0, 3)
    .map(t => ({
      id: t.id,
      type: t.type === 'pix_sent' ? 'Enviado' : 'Recebido',
      recipient: t.description.replace('PIX enviado - ', '').replace('PIX recebido - ', ''),
      amount: t.amount,
      time: new Date(t.date).toLocaleDateString('pt-BR'),
      status: t.status === 'completed' ? 'Concluído' : 'Pendente'
    }));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aqui você pode adicionar um toast de confirmação
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Área PIX</span>
            <span className="text-muted-foreground text-xs">Pagamentos instantâneos</span>
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
        {/* Saldo Card */}
        <div className="bg-card border border-border/30 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Saldo disponível</p>
                <p className="text-card-foreground font-medium">Conta principal</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-card-foreground text-3xl font-bold tracking-tight">
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-muted-foreground text-sm">Disponível para transferências</p>
          </div>
        </div>

        {/* Ações Principais */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-5 text-center hover:bg-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/pix/enviar')}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-primary/20 shadow-sm group-hover:shadow-md transition-all">
              <Send className="w-8 h-8 text-primary flex-shrink-0" />
            </div>
            <span className="text-card-foreground text-sm font-semibold block mb-1">Enviar PIX</span>
            <p className="text-muted-foreground text-xs">Transferir dinheiro</p>
          </div>
          
          <div 
            className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-5 text-center hover:bg-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/pix/receber')}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-primary/20 shadow-sm group-hover:shadow-md transition-all">
              <Download className="w-8 h-8 text-primary flex-shrink-0" />
            </div>
            <span className="text-card-foreground text-sm font-semibold block mb-1">Receber PIX</span>
            <p className="text-muted-foreground text-xs">Gerar QR Code</p>
          </div>
        </div>

        {/* Chaves PIX */}
        <div className="bg-card border border-border/30 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-card-foreground text-lg font-semibold">Suas chaves PIX</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/pix/gerenciar-chaves')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Gerenciar
            </Button>
          </div>
          <div className="space-y-3">
            {pixKeys.length > 0 ? (
              pixKeys.slice(0, 3).map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                      <Download className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{key.name || key.type}</p>
                      <p className="text-xs text-muted-foreground">{key.value}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(key.value)}
                    className="text-muted-foreground hover:text-card-foreground"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Download className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma chave PIX cadastrada</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/pix/gerenciar-chaves')}
                >
                  Adicionar Chave
                </Button>
              </div>
            )}
            {pixKeys.length > 3 && (
              <div className="text-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary"
                  onClick={() => navigate('/pix/gerenciar-chaves')}
                >
                  Ver todas ({pixKeys.length})
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Transações Recentes */}
        <div className="bg-card border border-border/30 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-card-foreground text-lg font-semibold">Transações recentes</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/carteira')}
            >
              Ver todas
            </Button>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === "Recebido" 
                        ? "bg-primary/20" 
                        : "bg-destructive/20"
                    }`}>
                      {transaction.type === "Recebido" ? (
                        <Download className="w-4 h-4 text-primary" />
                      ) : (
                        <Send className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{transaction.recipient}</p>
                      <p className="text-xs text-muted-foreground">{transaction.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      transaction.type === "Recebido" ? "text-primary" : "text-destructive"
                    }`}>
                      {transaction.type === "Recebido" ? "+" : "-"} R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma transação recente</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Suas transações PIX aparecerão aqui
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate('/pix/enviar')}
                >
                  Fazer primeira transferência
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/20 px-3 sm:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Início</span>
          </div>
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/agenda')}
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Agenda</span>
          </div>
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/carteira')}
          >
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Carteira</span>
          </div>
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/historico')}
          >
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Histórico</span>
          </div>
          <div 
            className="flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer"
            onClick={() => navigate('/menu')}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Menu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pix;
