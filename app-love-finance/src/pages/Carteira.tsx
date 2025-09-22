import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/contexts/BalanceContext";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Wallet,
  CreditCard,
  DollarSign,
  Home,
  Calendar,
  FileText,
  Menu,
  Eye,
  EyeOff,
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart3,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useState, useEffect } from "react";

const Carteira = () => {
  const { user, logout } = useAuth();
  const { balance, transactions: balanceTransactions } = useBalance();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Converter transações do contexto para o formato da carteira
  const transactions = balanceTransactions?.map(t => ({
    id: parseInt(t.id),
    description: t.description,
    amount: t.amount,
    type: t.amount > 0 ? "income" : "expense",
    date: new Date(t.date).toLocaleDateString('pt-BR'),
    category: getCategoryFromType(t.type)
  })) || [];

  const filteredTransactions = selectedFilter === 'todos' 
    ? transactions 
    : transactions.filter(t => t.type === selectedFilter);

  function getCategoryFromType(type: string) {
    switch (type) {
      case 'pix_sent':
        return 'PIX';
      case 'pix_received':
        return 'PIX';
      case 'anticipation':
        return 'Antecipação';
      case 'receivable':
        return 'Recebíveis';
      case 'boleto_payment':
        return 'Boleto';
      default:
        return 'Outros';
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PIX':
        return <DollarSign className="w-4 h-4" />;
      case 'Antecipação':
        return <TrendingUp className="w-4 h-4" />;
      case 'Recebíveis':
        return <CreditCard className="w-4 h-4" />;
      case 'Boleto':
        return <FileText className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PIX':
        return 'bg-blue-100 text-blue-600';
      case 'Antecipação':
        return 'bg-green-100 text-green-600';
      case 'Recebíveis':
        return 'bg-purple-100 text-purple-600';
      case 'Boleto':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Carteira</span>
            <span className="text-muted-foreground text-xs">Movimentações</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-primary text-xl font-bold">
            NEL<sup className="text-sm">3</sup><span className="text-destructive">+</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 pb-28">
        <div className="max-w-4xl mx-auto">
          {/* Balance Card */}
          <div className="bg-card border border-border/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-foreground">Saldo Disponível</h1>
                <p className="text-sm text-muted-foreground">Conta Corrente</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {showBalance ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "••••••"}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Movimentações</h2>
              <div className="flex gap-2">
                {[
                  { key: 'todos', label: 'Todos' },
                  { key: 'income', label: 'Receitas' },
                  { key: 'expense', label: 'Despesas' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === filter.key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-card border border-border/30 rounded-lg overflow-hidden">
            <div className="divide-y divide-border/30">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(transaction.category)}`}>
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-lg ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma movimentação encontrada</p>
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
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            <span className="text-foreground text-xs">Carteira</span>
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

export default Carteira;
