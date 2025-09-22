import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Home, Calendar, Wallet, FileText, Menu, Calculator, Clock, DollarSign, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Activity = {
  id: string;
  amount: number;
  title: string;
  receiveInDays: number;
  category: string;
  patientName: string;
  date: string;
};

const SimuladorAntecipacao = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get activity data from navigation state or use default
  const activity: Activity = location.state?.activity || {
    id: "1",
    amount: 800,
    title: "Consulta Cardiológica",
    receiveInDays: 30,
    category: "Cardiologia",
    patientName: "Maria Silva",
    date: "30/10/2024"
  };

  // Calculate anticipation details
  const grossValue = activity.amount;
  const serviceCost = Math.round(grossValue * 0.03); // 3% service cost
  const anticipationFee = "3% a.m.";
  const anticipatedValue = grossValue - serviceCost;

  // Calculate future date
  const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('pt-BR');
  };

  const handleAntecipar = async () => {
    setIsLoading(true);
    
    try {
      // Simulate confirmation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to upload page with activity data
      navigate('/antecipar/upload', { state: { activity } });
    } catch (error) {
      toast({
        title: "Erro na confirmação",
        description: "Ocorreu um erro ao confirmar a antecipação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-card/50 transition-colors rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Simular Antecipação</span>
            <span className="text-muted-foreground text-xs">{activity.title}</span>
          </div>
        </div>

      </header>

      {/* Content */}
      <div className="px-4 py-6 pb-28">
        {/* Activity Info Card */}
        <div className="bg-card/60 border border-border/30 rounded-3xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-card-foreground font-semibold">Detalhes da Atividade</h2>
              <p className="text-muted-foreground text-sm">{activity.category}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-card-foreground font-medium">{activity.title}</p>
            <p className="text-muted-foreground text-sm">Paciente: {activity.patientName}</p>
            <p className="text-muted-foreground text-sm">Data: {activity.date}</p>
          </div>
        </div>

        {/* Original Receipt Section */}
        <div className="bg-card/60 border border-border/30 rounded-3xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-card-foreground font-bold text-lg">
              A receber em {activity.receiveInDays} dias ({getFutureDate(activity.receiveInDays)})
            </h3>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-card/60 border border-border/30 rounded-3xl p-5 mb-6">
          <div className="space-y-4">
            {/* Gross Value */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Valor bruto:</span>
              <span className="text-card-foreground font-semibold">
                R$ {grossValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Service Cost */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Custo do serviço:</span>
              <span className="text-card-foreground font-semibold">
                R$ {serviceCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Anticipation Fee */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Taxa de antecipação:</span>
              <span className="text-card-foreground font-semibold">{anticipationFee}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-border/30 my-4"></div>

            {/* Anticipated Value */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
              <h4 className="text-card-foreground font-bold text-lg mb-2">
                Valor a receber antecipado
              </h4>
              <div className="text-2xl font-bold text-primary">
                R$ {anticipatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Como funciona?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ao antecipar, você receberá o valor imediatamente em sua conta, 
                descontando apenas a taxa de serviço. O valor será creditado 
                instantaneamente após a confirmação.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <Button
            onClick={handleAntecipar}
            disabled={isLoading}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? "Processando..." : "Antecipar"}
          </Button>
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

export default SimuladorAntecipacao;
