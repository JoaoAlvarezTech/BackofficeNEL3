import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAnticipation } from "@/contexts/AnticipationContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Home, Calendar, Wallet, FileText, Menu, Zap, Clock, TrendingUp, DollarSign, AlertCircle } from "lucide-react";

type Activity = {
  id: string;
  amount: number;
  title: string;
  receiveInDays: number;
  category: string;
  patientName: string;
  date: string;
};

const activities: Activity[] = [
  { 
    id: "1", 
    amount: 1250, 
    title: "Consulta Cardiológica", 
    receiveInDays: 7,
    category: "Cardiologia",
    patientName: "Maria Silva",
    date: "15/09/2024"
  },
  { 
    id: "2", 
    amount: 890, 
    title: "Exame Laboratorial", 
    receiveInDays: 14,
    category: "Laboratório",
    patientName: "João Santos",
    date: "22/09/2024"
  },
  { 
    id: "3", 
    amount: 2100, 
    title: "Procedimento Cirúrgico", 
    receiveInDays: 21,
    category: "Cirurgia",
    patientName: "Ana Costa",
    date: "29/09/2024"
  },
  { 
    id: "4", 
    amount: 650, 
    title: "Consulta de Retorno", 
    receiveInDays: 28,
    category: "Clínica Geral",
    patientName: "Pedro Lima",
    date: "06/10/2024"
  },
];

const AtividadesAntecipacao = () => {
  const { logout } = useAuth();
  const { getAvailableActivities, submitAnticipation } = useAnticipation();
  const navigate = useNavigate();

  const availableActivities = getAvailableActivities()
    .sort((a, b) => a.receiveInDays - b.receiveInDays); // Ordenar por prazo crescente
  const totalAmount = availableActivities.reduce((sum, activity) => sum + activity.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/antecipar')}
            className="p-2 hover:bg-card/50 transition-colors rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Antecipação de Recebíveis</span>
            <span className="text-muted-foreground text-xs">Selecione uma atividade para simular</span>
          </div>
        </div>

      </header>

      {/* Content */}
      <div className="px-4 py-6 pb-28">
                 {/* Summary Card */}
         <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Total Disponível</h2>
                <p className="text-white/80 text-sm">Para antecipação</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-2xl">
                R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-white/80 text-sm">{activities.length} atividades</div>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Zap className="w-4 h-4" />
              <span>Antecipação instantânea com taxa reduzida</span>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
                          {availableActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl p-5 hover:bg-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={async () => {
                // Submeter antecipação
                await submitAnticipation(activity.id);
                navigate('/antecipar/simulador', { state: { activity } });
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                                         <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-card-foreground font-bold text-lg">
                        R$ {activity.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="text-muted-foreground text-xs">{activity.category}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-card-foreground font-medium">{activity.title}</p>
                    <p className="text-muted-foreground text-sm">Paciente: {activity.patientName}</p>
                    <p className="text-muted-foreground text-sm">Data: {activity.date}</p>
                  </div>
                </div>
                
                                 <div className="flex flex-col items-end gap-2">
                   <div className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                     activity.receiveInDays <= 7 
                       ? 'bg-green-50 border border-green-200' 
                       : activity.receiveInDays <= 14 
                       ? 'bg-yellow-50 border border-yellow-200'
                       : 'bg-blue-50 border border-blue-200'
                   }`}>
                     <Clock className={`w-3 h-3 ${
                       activity.receiveInDays <= 7 
                         ? 'text-green-600' 
                         : activity.receiveInDays <= 14 
                         ? 'text-yellow-600'
                         : 'text-blue-600'
                     }`} />
                     <span className={`text-xs font-medium ${
                       activity.receiveInDays <= 7 
                         ? 'text-green-600' 
                         : activity.receiveInDays <= 14 
                         ? 'text-yellow-600'
                         : 'text-blue-600'
                     }`}>
                       {activity.receiveInDays} dias
                     </span>
                   </div>
                   <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                 </div>
              </div>
              

            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Como funciona?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione uma atividade acima para simular a antecipação. 
                Você receberá o valor imediatamente com uma pequena taxa de desconto, 
                baseada no prazo de recebimento.
              </p>
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
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            <span className="text-foreground text-xs">Menu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtividadesAntecipacao;


