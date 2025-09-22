import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  MoreVertical,
  Home,
  Wallet,
  FileText,
  Menu,
  Clock,
  Users,
  ArrowRight,
  Star
} from "lucide-react";
import { useState } from "react";

const Agenda = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Dados simulados de eventos
  const events = {
    "2025-09-02": [
      {
        id: 1,
        time: "10:00-13:00",
        title: "Consultas X Santa Casa",
        description: "Consultas de X tipo",
        type: "consulta",
        priority: "high"
      },
      {
        id: 2,
        time: "15:00-17:00",
        title: "Exames Médicos X",
        description: "Exames para pacientes X",
        type: "exame",
        priority: "medium"
      },
      {
        id: 3,
        time: "18:00-06:00",
        title: "Plantão X Santa Casa",
        description: "Plantão Quinta-Feira para Sexta-Feira",
        type: "plantao",
        priority: "high"
      }
    ],
    "2025-09-06": [
      {
        id: 4,
        time: "08:00-12:00",
        title: "Consultas Clínicas",
        description: "Atendimento ambulatorial",
        type: "consulta",
        priority: "medium"
      }
    ],
    "2025-09-07": [
      {
        id: 5,
        time: "14:00-18:00",
        title: "Exames Especializados",
        description: "Exames cardiológicos",
        type: "exame",
        priority: "high"
      }
    ],
    "2025-09-11": [
      {
        id: 6,
        time: "09:00-17:00",
        title: "Cirurgia Programada",
        description: "Procedimento cirúrgico",
        type: "cirurgia",
        priority: "high"
      }
    ],
    "2025-09-14": [
      {
        id: 7,
        time: "08:00-16:00",
        title: "Plantão Hospitalar",
        description: "Plantão de emergência",
        type: "plantao",
        priority: "high"
      }
    ],
    "2025-09-15": [
      {
        id: 8,
        time: "10:00-14:00",
        title: "Consultas Especializadas",
        description: "Atendimento especializado",
        type: "consulta",
        priority: "medium"
      }
    ],
    "2025-09-19": [
      {
        id: 9,
        time: "13:00-17:00",
        title: "Exames Laboratoriais",
        description: "Análises clínicas",
        type: "exame",
        priority: "low"
      }
    ],
    "2025-09-24": [
      {
        id: 10,
        time: "07:00-15:00",
        title: "Cirurgia de Emergência",
        description: "Procedimento urgente",
        type: "cirurgia",
        priority: "high"
      }
    ],
    "2025-09-27": [
      {
        id: 11,
        time: "08:00-12:00",
        title: "Consultas de Retorno",
        description: "Acompanhamento de pacientes",
        type: "consulta",
        priority: "medium"
      }
    ],
    "2025-09-28": [
      {
        id: 12,
        time: "16:00-20:00",
        title: "Plantão Noturno",
        description: "Plantão de fim de semana",
        type: "plantao",
        priority: "high"
      }
    ],
    "2025-08-31": [
      {
        id: 13,
        time: "09:00-13:00",
        title: "Consultas de Segunda",
        description: "Início da semana",
        type: "consulta",
        priority: "medium"
      }
    ]
  };

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Segunda = 0

    const days = [];
    
    // Dias do mês anterior
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === new Date().toDateString()
      });
    }

    // Dias do próximo mês
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return events[dateKey] || [];
  };

  const hasEvents = (date: Date) => {
    const dateKey = formatDateKey(date);
    return events[dateKey] && events[dateKey].length > 0;
  };

  const getEventCount = (date: Date) => {
    const dateKey = formatDateKey(date);
    return events[dateKey] ? events[dateKey].length : 0;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePreviousYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  };

  const handleNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'consulta':
        return 'bg-blue-500';
      case 'exame':
        return 'bg-green-500';
      case 'plantao':
        return 'bg-orange-500';
      case 'cirurgia':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const calendarDays = getDaysInMonth(currentDate);
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousYear}
                className="p-1 text-primary hover:bg-primary/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-primary text-lg font-medium">
                {currentDate.getFullYear()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextYear}
                className="p-1 text-primary hover:bg-primary/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-muted-foreground text-xs">Agenda</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-primary text-xl font-bold tracking-tight">
            NEL<sup className="text-sm">3</sup><span className="text-destructive">+</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-foreground hover:bg-card"
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-foreground hover:bg-card"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Month Navigation */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousMonth}
            className="p-2 text-foreground hover:bg-card rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {months[currentDate.getMonth()]}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="p-2 text-foreground hover:bg-card rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-4 mb-4">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isSelected = day.date.toDateString() === selectedDate.toDateString();
            const dayEvents = getEventsForDate(day.date);
            const eventCount = getEventCount(day.date);

            return (
              <div
                key={index}
                className={`aspect-square p-1 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground rounded-lg'
                    : day.isToday
                    ? 'bg-primary/10 text-primary rounded-lg'
                    : day.isCurrentMonth
                    ? 'text-foreground hover:bg-card/50 rounded-lg'
                    : 'text-muted-foreground'
                }`}
                onClick={() => handleDateClick(day.date)}
              >
                <div className="h-full flex flex-col">
                  <div className="text-sm font-medium mb-1">
                    {day.date.getDate()}
                  </div>
                  {eventCount > 0 && (
                    <div className="flex justify-center gap-0.5">
                      {dayEvents.slice(0, 2).map((_, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? 'bg-primary-foreground' : 'bg-primary'
                          }`}
                        />
                      ))}
                      {eventCount > 2 && (
                        <div
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? 'bg-primary-foreground' : 'bg-primary'
                          }`}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events for Selected Date */}
      <div className="px-4 mb-4">
        {selectedDateEvents.length > 0 ? (
          <div className="space-y-3">
            {selectedDateEvents.map((event) => (
              <div
                key={event.id}
                className="bg-card border border-border/30 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`} />
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-medium">
                          {event.time}
                        </span>
                      </div>
                      {event.priority === 'high' && (
                        <Star className="w-4 h-4 text-red-500 fill-current" />
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-card-foreground mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Nenhum evento para {selectedDate.toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-32 space-y-4">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
          onClick={() => navigate('/agenda/futuras')}
        >
          <Calendar className="w-5 h-5" />
          Tarefas Futuras
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        <Button
          variant="outline"
          className="w-full border-primary/30 hover:bg-primary/5 text-primary py-4 text-lg font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
          onClick={() => navigate('/agenda/trocas')}
        >
          <Users className="w-5 h-5" />
          Troca de Escalas
          <ArrowRight className="w-5 h-5" />
        </Button>
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
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            <span className="text-foreground text-xs">Agenda</span>
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

export default Agenda;
