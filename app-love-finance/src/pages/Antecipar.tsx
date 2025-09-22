import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAnticipation } from "@/contexts/AnticipationContext";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  ArrowLeft,
  EyeOff,
  Clock,
  History,
  Home,
  Calendar,
  Wallet,
  FileText,
  Menu,
  TrendingUp
} from "lucide-react";

const Antecipar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { 
    getTotalAvailable, 
    getTotalInProgress, 
    getTotalCompleted,
    getAvailableActivities,
    getInProgressActivities,
    getCompletedActivities
  } = useAnticipation();

  // Dados reais das antecipações
  const totalAvailable = getTotalAvailable();
  const totalInProgress = getTotalInProgress();
  const totalCompleted = getTotalCompleted();
  const total = totalAvailable + totalInProgress + totalCompleted;

  const anticipationData = {
    totalAvailable: total,
    anticipated: totalCompleted,
    availableToAnticipate: totalAvailable,
    inProgress: totalInProgress,
    topBalance: totalAvailable
  };

  // Helpers para desenhar arcos (semicírculo) em SVG
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/20 px-4 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="p-2.5 hover:bg-card transition-colors rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Área Antecipação</span>
            <span className="text-muted-foreground text-xs">Gerencie seus recebíveis</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-primary text-xl font-bold tracking-tight">
            NEL<sup className="text-sm">3</sup><span className="text-destructive">+</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-8 pb-32 space-y-10">
        {/* Ações Rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <div 
            className="bg-card/90 backdrop-blur-sm border border-border/40 rounded-2xl p-4 text-center hover:bg-card hover:shadow-xl transition-all duration-300 cursor-pointer group h-24 flex flex-col items-center justify-center"
            onClick={() => navigate('/antecipar/processo')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500/25 to-orange-400/35 rounded-lg flex items-center justify-center mb-3 border border-orange-500/30 shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
            </div>
            <h3 className="text-card-foreground text-sm font-bold leading-none">Em Andamento</h3>
          </div>
          
          <div 
            className="bg-card/90 backdrop-blur-sm border border-border/40 rounded-2xl p-4 text-center hover:bg-card hover:shadow-xl transition-all duration-300 cursor-pointer group h-24 flex flex-col items-center justify-center"
            onClick={() => navigate('/antecipar/historico')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/25 to-blue-400/35 rounded-lg flex items-center justify-center mb-3 border border-blue-500/30 shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <History className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
            <h3 className="text-card-foreground text-sm font-bold leading-none">Histórico</h3>
          </div>
          
          <div 
            className="bg-card/90 backdrop-blur-sm border border-border/40 rounded-2xl p-4 text-center hover:bg-card hover:shadow-xl transition-all duration-300 cursor-pointer group h-24 flex flex-col items-center justify-center"
            onClick={() => navigate('/antecipar/atividades')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary/25 to-primary/35 rounded-lg flex items-center justify-center mb-3 border border-primary/30 shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <Wallet className="w-5 h-5 text-primary flex-shrink-0" />
            </div>
            <h3 className="text-card-foreground text-sm font-bold leading-none">Antecipar</h3>
          </div>
        </div>

        {/* Gráfico de Distribuição */}
        <div className="bg-card/90 backdrop-blur-sm border border-border/30 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-card-foreground text-2xl font-bold mb-3 tracking-tight">Distribuição dos Recebíveis</h2>
            <p className="text-muted-foreground text-base font-medium">Visão geral dos seus valores antecipados</p>
          </div>
          
          <div className="flex justify-center mb-10">
            <div className="relative w-72 h-72">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Trilha de fundo circular */}
                <circle cx="100" cy="100" r="75" stroke="hsl(var(--border))" strokeWidth="8" fill="none" className="opacity-20" />

                {(() => {
                  const total = anticipationData.totalAvailable;
                  const segments = [
                    { value: anticipationData.anticipated, color: 'hsl(var(--destructive))' },
                    { value: anticipationData.availableToAnticipate, color: 'hsl(var(--primary))' },
                    { value: anticipationData.inProgress, color: '#10b981' }
                  ];
                  let start = 0;
                  return segments.map((seg, idx) => {
                    const angle = (seg.value / total) * 360;
                    const overlap = 0.8;
                    const end = Math.min(360, start + angle + (idx < segments.length - 1 ? overlap : 0));
                    const d = describeArc(100, 100, 75, start, end);
                    start = end;
                    return (
                      <path key={idx} d={d} stroke={seg.color} strokeWidth="14" strokeLinecap="round" fill="none" className="drop-shadow-md" />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-card-foreground text-4xl font-black leading-tight tracking-tight">
                  R$ {anticipationData.totalAvailable.toLocaleString('pt-BR')}
                </span>
                <span className="text-muted-foreground text-base font-semibold mt-1">Total disponível</span>
              </div>
            </div>
          </div>

          {/* Detalhamento dos Valores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-destructive/8 border border-destructive/25 rounded-2xl hover:bg-destructive/12 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-destructive shadow-sm"></div>
                <span className="text-card-foreground font-semibold text-lg">Antecipado</span>
              </div>
              <span className="text-card-foreground font-bold text-xl">
                R$ {anticipationData.anticipated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-primary/8 border border-primary/25 rounded-2xl hover:bg-primary/12 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-primary shadow-sm"></div>
                <span className="text-card-foreground font-semibold text-lg">Disponível para antecipação</span>
              </div>
              <span className="text-card-foreground font-bold text-xl">
                R$ {anticipationData.availableToAnticipate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl hover:bg-emerald-500/15 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm"></div>
                <span className="text-card-foreground font-semibold text-lg">Em andamento</span>
              </div>
              <span className="text-card-foreground font-bold text-xl">
                R$ {anticipationData.inProgress.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
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

export default Antecipar;