import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAnticipation } from "@/contexts/AnticipationContext";
import { useBalance } from "@/contexts/BalanceContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Calendar, Wallet, FileText, Menu, Clock, TrendingUp, DollarSign, FileText as FileTextIcon, AlertCircle } from "lucide-react";

const AntecipacoesEmProcesso = () => {
  const { logout } = useAuth();
  const { getInProgressActivities, completeAnticipation, calculateAnticipationDetails } = useAnticipation();
  const { simulateAnticipation } = useBalance();
  const navigate = useNavigate();

  const inProgressActivities = getInProgressActivities();

  const totalAmount = inProgressActivities.reduce((sum, antecipacao) => sum + antecipacao.amount, 0);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'analisando':
        return 'Analisando nota fiscal';
      case 'aprovando':
        return 'Aprovando antecipação';
      case 'processando':
        return 'Processando pagamento';
      default:
        return 'Em processamento';
    }
  };

     const getStatusColor = (status: string) => {
     switch (status) {
       case 'analisando':
         return 'text-primary bg-primary/10 border-primary/20';
       case 'aprovando':
         return 'text-orange-500 bg-orange-50 border-orange-200';
       case 'processando':
         return 'text-green-500 bg-green-50 border-green-200';
       default:
         return 'text-muted-foreground bg-muted border-border';
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
            onClick={() => navigate('/antecipar')}
            className="p-2 hover:bg-card/50 transition-colors rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Antecipações em Processo</span>
            <span className="text-muted-foreground text-xs">Acompanhe o status das suas antecipações</span>
          </div>
        </div>

      </header>

      {/* Content */}
      <div className="px-4 py-6 pb-28">
                 {/* Summary Card */}
         <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-6 mb-6 shadow-lg">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                 <Clock className="w-6 h-6 text-white" />
               </div>
               <div>
                 <h2 className="text-white font-bold text-lg">Em Processamento</h2>
                 <p className="text-white/80 text-sm">Total de antecipações</p>
               </div>
             </div>
             <div className="text-right">
               <div className="text-white font-bold text-2xl">
                 R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </div>
               <div className="text-white/80 text-sm">{inProgressActivities.length} antecipações</div>
             </div>
           </div>
           <div className="bg-white/10 rounded-2xl p-3">
             <div className="flex items-center gap-2 text-white/90 text-sm">
               <FileTextIcon className="w-4 h-4" />
               <span>Análise e processamento em andamento</span>
             </div>
           </div>
         </div>

        {/* Antecipações List */}
        <div className="space-y-4">
                      {inProgressActivities.map((antecipacao) => (
            <div
              key={antecipacao.id}
              className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl p-5 hover:bg-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
                             <div className="flex items-start justify-between mb-3">
                 <div className="flex-1">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                       <DollarSign className="w-4 h-4 text-white" />
                     </div>
                     <div>
                       <h3 className="text-card-foreground font-bold text-lg">
                         R$ {antecipacao.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                       </h3>
                       <p className="text-muted-foreground text-xs">{antecipacao.category}</p>
                     </div>
                   </div>
                   
                   <div className="space-y-1">
                     <p className="text-card-foreground font-medium">{antecipacao.title}</p>
                     <p className="text-muted-foreground text-sm">Paciente: {antecipacao.patientName}</p>
                     <p className="text-muted-foreground text-sm">Data: {antecipacao.date}</p>
                     <p className="text-muted-foreground text-sm">Enviado em: {antecipacao.submittedDate}</p>
                   </div>
                 </div>
                 
                 <div className="flex flex-col items-end gap-2">
                   <div className={`flex items-center gap-1 border rounded-full px-3 py-1 ${getStatusColor(antecipacao.status)}`}>
                     <Clock className="w-3 h-3" />
                     <span className="text-xs font-medium">
                       {getStatusText(antecipacao.status)}
                     </span>
                   </div>
                 </div>
               </div>
               
               {/* Botão para completar antecipação */}
               <div className="flex justify-end mt-4">
                 <Button
                   onClick={async (e) => {
                     e.stopPropagation();
                     
                     // Completar a antecipação
                     const success = await completeAnticipation(antecipacao.id);
                     
                     if (success) {
                       // Calcular o valor líquido da antecipação
                       const details = calculateAnticipationDetails(antecipacao.amount, antecipacao.receiveInDays);
                       
                       // Adicionar ao saldo
                       await simulateAnticipation(details.anticipatedValue, antecipacao.title);
                     }
                   }}
                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                 >
                   Completar Antecipação
                 </Button>
               </div>
            </div>
          ))}
        </div>

                 {/* Info Card */}
         <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
           <div className="flex items-start gap-2">
             <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
             <div>
               <p className="text-sm font-medium text-card-foreground">Como funciona o processamento?</p>
               <p className="text-sm text-muted-foreground mt-1">
                 Suas antecipações passam por análise da nota fiscal, aprovação e processamento do pagamento. 
                 Você será notificado quando cada etapa for concluída.
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

export default AntecipacoesEmProcesso;
