import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  FileText,
  Calendar,
  Clock,
  DollarSign,
  Home,
  Wallet,
  Menu,
  History
} from "lucide-react";
import { useState } from "react";

const Historico = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const historyItems = [
    {
      id: 1,
      type: "Consulta",
      patient: "Maria Silva",
      date: "15/01/2025",
      time: "14:00",
      amount: 150.00,
      status: "Concluída",
      specialty: "Cardiologia"
    },
    {
      id: 2,
      type: "Cirurgia",
      patient: "João Santos",
      date: "14/01/2025",
      time: "09:30",
      amount: 2500.00,
      status: "Concluída",
      specialty: "Cardiologia"
    },
    {
      id: 3,
      type: "Plantão",
      patient: "Hospital Santa Maria",
      date: "13/01/2025",
      time: "16:00",
      amount: 800.00,
      status: "Concluída",
      specialty: "Plantão"
    },
    {
      id: 4,
      type: "Consulta",
      patient: "Ana Costa",
      date: "12/01/2025",
      time: "15:30",
      amount: 150.00,
      status: "Concluída",
      specialty: "Cardiologia"
    },
    {
      id: 5,
      type: "Plantão",
      patient: "Hospital São José",
      date: "11/01/2025",
      time: "08:00",
      amount: 800.00,
      status: "Concluída",
      specialty: "Plantão"
    }
  ];

  // Apenas atividades concluídas
  const completedItems = historyItems.filter(item => item.status === 'Concluída');





  return (
    <div className="min-h-screen bg-background">
             {/* Header */}
       <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
             <History className="w-5 h-5 text-primary" />
           </div>
           <div>
             <span className="text-foreground text-base font-semibold block">Histórico</span>
             <span className="text-muted-foreground text-xs">Atividades concluídas</span>
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
                       {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-card border border-border/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
                <p className="text-xl font-bold text-foreground">{completedItems.length}</p>
              </div>

              <div className="bg-card border border-border/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Faturamento</span>
                </div>
                <p className="text-xl font-bold text-primary">
                  R$ {completedItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-card border border-border/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Ticket Médio</span>
                </div>
                <p className="text-xl font-bold text-primary">
                  R$ {(completedItems.reduce((sum, item) => sum + item.amount, 0) / Math.max(completedItems.length, 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

                                                                                       {/* Header da Lista */}
             <div className="bg-card border border-border/30 rounded-lg p-4 mb-6">
               <h2 className="text-base font-semibold text-foreground">Atividades Concluídas</h2>
             </div>

                                                                                       {/* History List */}
             <div className="bg-card border border-border/30 rounded-lg overflow-hidden">
               <div className="divide-y divide-border/30">
                 {completedItems.map((item) => (
                   <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                           <User className="w-5 h-5 text-primary" />
                         </div>
                         <div>
                           <p className="font-medium text-foreground">{item.patient}</p>
                           <div className="flex items-center gap-2 mt-1">
                             <span className="text-sm text-muted-foreground">{item.date} • {item.time}</span>
                             <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                               {item.type}
                             </span>
                           </div>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="font-semibold text-primary text-lg">R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>

               {completedItems.length === 0 && (
                 <div className="p-8 text-center">
                   <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                   <p className="text-muted-foreground">Nenhuma atividade concluída encontrada</p>
                   <p className="text-sm text-muted-foreground mt-1">Suas atividades concluídas aparecerão aqui</p>
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
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            <span className="text-foreground text-xs">Histórico</span>
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

export default Historico;
