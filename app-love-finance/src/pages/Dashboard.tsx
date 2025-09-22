import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/contexts/BalanceContext";
import { useAnticipation } from "@/contexts/AnticipationContext";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Search,
  Bell, 
  EyeOff,
  Eye,
  ArrowRight,
  DollarSign,
  Home,
  Calendar,
  Wallet,
  FileText,
  Menu,
  Scan
} from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { balance } = useBalance();
  const { getTotalAvailable, getTotalInProgress, getCompletedActivities } = useAnticipation();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const chartData = [
    { month: "JAN", value: 18500 },
    { month: "FEV", value: 22100 },
    { month: "MAR", value: 19800 },
    { month: "ABR", value: 25600 },
    { month: "MAI", value: 23400 },
    { month: "JUN", value: 31200 },
    { month: "JUL", value: 28900 },
    { month: "AGO", value: 34500 },
    { month: "SET", value: 32100 },
    { month: "OUT", value: 37800 },
    { month: "NOV", value: 41200 },
    { month: "DEZ", value: 45600 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  // Calcular estatísticas reais baseadas nas antecipações concluídas
  const completedActivities = getCompletedActivities();
  const totalCompleted = completedActivities.reduce((sum, activity) => sum + (activity.receivedAmount || 0), 0);
  
  // Calcular média mensal (assumindo 12 meses)
  const monthlyAverage = totalCompleted / 12;
  
  // Calcular total anual (soma de todas as antecipações concluídas)
  const annualTotal = totalCompleted;
  
  // Calcular variação (simulado para demonstração)
  const monthlyGrowth = 15; // +15% vs mês anterior
  const annualGrowth = 22; // +22% vs ano anterior

  return (
    <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="bg-background p-3 sm:p-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Dr. João Alvarez</span>
            <span className="text-muted-foreground text-xs">Dashboard</span>
          </div>
        </div>
         <div className="flex items-center gap-2 sm:gap-4">
           <div className="text-primary text-lg sm:text-xl font-bold">
             NEL<sup className="text-xs sm:text-sm">3</sup><span className="text-red-500">+</span>
           </div>
                     <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="text-foreground border-foreground hover:bg-foreground hover:text-background text-xs sm:text-sm px-2 sm:px-3"
          >
            Sair
          </Button>
         </div>
       </header>

      {/* Search Section */}
      <div className="px-3 sm:px-4 py-2 mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar..."
                className="pl-10 pr-4 py-2 bg-card border-border/20 focus:border-primary"
              />
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 ml-3">
            <div className="relative">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            </div>
            <div 
              className="cursor-pointer"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? (
                <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 text-foreground hover:text-primary transition-colors" />
              ) : (
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-foreground hover:text-primary transition-colors" />
              )}
            </div>
          </div>
        </div>
      </div>

                      {/* Balance Section */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 mb-4 sm:mb-6">
          <p className="text-primary text-sm sm:text-lg font-medium mb-1 sm:mb-2">Saldo disponível</p>
          <p className="text-foreground text-3xl sm:text-4xl lg:text-5xl font-bold">
            {showBalance ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "••••••••"}
          </p>
        </div>

             {/* Quick Actions - 3 items */}
       <div className="px-3 sm:px-4 mb-6 sm:mb-8">
         <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div 
            className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => navigate('/pix')}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-muted/20 rounded-2xl flex items-center justify-center">
              <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 border-2 border-foreground rounded flex items-center justify-center">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-foreground rounded-full"></div>
              </div>
            </div>
            <span className="text-foreground text-xs sm:text-sm font-medium text-center">PIX</span>
          </div>

          <div 
            className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => navigate('/boleto')}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-muted/20 rounded-2xl flex items-center justify-center">
              <Scan className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-foreground" />
            </div>
            <span className="text-foreground text-xs sm:text-sm font-medium text-center">Boleto</span>
          </div>

          <div 
            className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => navigate('/antecipar')}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-muted/20 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-foreground" />
            </div>
            <span className="text-foreground text-xs sm:text-sm font-medium text-center">Antecipar</span>
          </div>

          
        </div>
      </div>

      {/* Recebíveis Card */}
      <div className="px-3 sm:px-4 mb-6 sm:mb-8">
        <div className="bg-card rounded-2xl p-4 sm:p-6 text-card-foreground shadow-card">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="flex-1 mr-3">
              <h3 className="text-sm sm:text-lg font-medium text-muted-foreground mb-1">Antecipação Disponível</h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-card-foreground">
                {showBalance ? `R$ ${getTotalAvailable().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "••••••••"}
              </p>
            </div>
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
              onClick={() => navigate('/antecipar')}
            >
              Antecipar
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-muted-foreground font-medium text-xs sm:text-sm">Antecipação em Processamento</span>
            </div>
            <span className="text-sm sm:text-lg font-bold text-card-foreground">
              {showBalance ? `R$ ${getTotalInProgress().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "••••••••"}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="px-3 sm:px-4 mb-6 sm:mb-8">
        <h3 className="text-foreground text-lg sm:text-xl font-medium mb-4 sm:mb-6">Seus rendimentos de 2025</h3>
        <div className="flex items-end justify-between h-32 sm:h-40 lg:h-48 gap-1 sm:gap-2">
          {chartData.map((data, index) => {
            // Cálculo da altura da barra em pixels - responsivo
            const maxHeight = window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 140 : 160;
            const barHeightPx = (data.value / maxValue) * maxHeight;
            const barHeight = Math.max(barHeightPx, 8); // altura mínima de 8px para mobile
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                                       <div
                         className="w-full bg-blue-500 rounded-t-md mb-1 sm:mb-2 transition-all duration-300 hover:bg-blue-600 cursor-pointer shadow-md"
                         style={{
                           height: `${barHeight}px`,
                           minHeight: '8px'
                         }}
                         title={`${data.month}: R$ ${data.value.toLocaleString('pt-BR')}`}
                       ></div>
                <span className="text-foreground text-xs font-medium">
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>
        
      </div>

              {/* Monthly Stats */}
       <div className="px-3 sm:px-4 mb-16 sm:mb-20 lg:mb-24">
         <div className="grid grid-cols-2 gap-3 sm:gap-4">
                       <div className="bg-card rounded-2xl p-3 sm:p-4 text-card-foreground shadow-card">
              <h4 className="text-muted-foreground text-xs sm:text-sm font-medium mb-1 sm:mb-2">Média mensal</h4>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground">
                {showBalance ? `R$ ${monthlyAverage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "••••••••"}
              </p>
              <p className="text-green-600 text-xs sm:text-sm font-medium">+{monthlyGrowth}% vs mês anterior</p>
            </div>
            <div className="bg-card rounded-2xl p-3 sm:p-4 text-card-foreground shadow-card">
              <h4 className="text-muted-foreground text-xs sm:text-sm font-medium mb-1 sm:mb-2">Total anual</h4>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground">
                {showBalance ? `R$ ${annualTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "••••••••"}
              </p>
              <p className="text-blue-600 text-xs sm:text-sm font-medium">+{annualGrowth}% vs ano anterior</p>
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
             <Home className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
             <span className="text-foreground text-xs">Início</span>
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

export default Dashboard;