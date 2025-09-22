import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MoreVertical,
  Home,
  Wallet,
  FileText,
  Menu,
  Search,
  Filter,
  MapPin,
  Activity,
  X
} from "lucide-react";
import { useState, useMemo } from "react";

interface Evento {
  id: number;
  date: string;
  time: string;
  title: string;
  description: string;
  type: string;
  location: string;
  patientName?: string;
  hospital?: string;
  status: 'realizado' | 'ocorrendo' | 'aberto' | 'nao_compareceu';
}

const AgendaFuturas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados para busca e filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Obter data atual real
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  const currentDate = getCurrentDate();

  // Função para determinar status baseado na data atual
  const getEventStatus = (eventDate: string, eventTime: string) => {
    const today = new Date();
    const eventDateTime = new Date(`${eventDate}T${eventTime.split('-')[0]}:00`);
    const eventEndTime = new Date(`${eventDate}T${eventTime.split('-')[1]}:00`);
    
    // Se a data do evento é anterior a hoje
    if (eventDate < currentDate) {
      // Simular alguns eventos como "não compareceu" para demonstração
      const random = Math.random();
      return random > 0.7 ? 'nao_compareceu' : 'realizado';
    }
    
    // Se a data do evento é hoje
    if (eventDate === currentDate) {
      const now = new Date();
      const eventStart = new Date(`${eventDate}T${eventTime.split('-')[0]}:00`);
      const eventEnd = new Date(`${eventDate}T${eventTime.split('-')[1]}:00`);
      
      // Se o evento está acontecendo agora
      if (now >= eventStart && now <= eventEnd) {
        return 'ocorrendo';
      }
      // Se o evento já passou hoje
      else if (now > eventEnd) {
        return 'realizado';
      }
      // Se o evento ainda vai acontecer hoje
      else {
        return 'aberto';
      }
    }
    
    // Se a data do evento é futura
    return 'aberto';
  };

  // Dados simulados de eventos com status dinâmico baseado na data atual
  const futureEvents: Evento[] = [
    {
      id: 1,
      date: "2025-01-25",
      time: "10:00-13:00",
      title: "Consultas Cardiologia",
      description: "Consultas de cardiologia ambulatorial",
      type: "consulta",
      location: "Hospital Santa Casa",
      patientName: "Dr. Silva",
      status: getEventStatus("2025-01-25", "10:00-13:00")
    },
    {
      id: 2,
      date: "2025-01-25",
      time: "15:00-17:00",
      title: "Exames Cardiológicos",
      description: "Exames para pacientes cardíacos",
      type: "exame",
      location: "Clínica Central",
      patientName: "Dr. Santos",
      status: getEventStatus("2025-01-25", "15:00-17:00")
    },
    {
      id: 3,
      date: "2025-01-26",
      time: "18:00-06:00",
      title: "Plantão Noturno",
      description: "Plantão de emergência noturno",
      type: "plantao",
      location: "Hospital Santa Casa",
      hospital: "Santa Casa",
      status: getEventStatus("2025-01-26", "18:00-06:00")
    },
    {
      id: 4,
      date: "2025-01-27",
      time: "08:00-12:00",
      title: "Consultas Clínicas",
      description: "Atendimento ambulatorial geral",
      type: "consulta",
      location: "Clínica Central",
      patientName: "Dr. Costa",
      status: getEventStatus("2025-01-27", "08:00-12:00")
    },
    {
      id: 5,
      date: "2025-01-28",
      time: "14:00-18:00",
      title: "Exames Especializados",
      description: "Exames cardiológicos especializados",
      type: "exame",
      location: "Hospital Regional",
      patientName: "Dr. Lima",
      status: getEventStatus("2025-01-28", "14:00-18:00")
    },
    {
      id: 6,
      date: "2025-01-29",
      time: "09:00-17:00",
      title: "Cirurgia Cardíaca",
      description: "Procedimento cirúrgico cardíaco",
      type: "cirurgia",
      location: "Hospital Santa Casa",
      hospital: "Santa Casa",
      status: getEventStatus("2025-01-29", "09:00-17:00")
    },
    {
      id: 7,
      date: "2025-01-30",
      time: "08:00-16:00",
      title: "Plantão Hospitalar",
      description: "Plantão de emergência diurno",
      type: "plantao",
      location: "Hospital Regional",
      hospital: "Regional",
      status: getEventStatus("2025-01-30", "08:00-16:00")
    },
    {
      id: 8,
      date: "2025-01-31",
      time: "10:00-14:00",
      title: "Consultas Especializadas",
      description: "Atendimento especializado cardiológico",
      type: "consulta",
      location: "Clínica Central",
      patientName: "Dr. Oliveira",
      status: getEventStatus("2025-01-31", "10:00-14:00")
    },
    {
      id: 9,
      date: "2025-02-01",
      time: "13:00-17:00",
      title: "Exames Laboratoriais",
      description: "Análises clínicas cardiológicas",
      type: "exame",
      location: "Laboratório Central",
      patientName: "Dr. Ferreira",
      status: getEventStatus("2025-02-01", "13:00-17:00")
    },
    {
      id: 10,
      date: "2025-02-02",
      time: "07:00-15:00",
      title: "Cirurgia de Emergência",
      description: "Procedimento cirúrgico urgente",
      type: "cirurgia",
      location: "Hospital Santa Casa",
      hospital: "Santa Casa",
      status: getEventStatus("2025-02-02", "07:00-15:00")
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizado':
        return 'bg-blue-500';
      case 'ocorrendo':
        return 'bg-green-500';
      case 'aberto':
        return 'bg-gray-500';
      case 'nao_compareceu':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'realizado':
        return 'Realizado';
      case 'ocorrendo':
        return 'Ocorrendo';
      case 'aberto':
        return 'Em aberto';
      case 'nao_compareceu':
        return 'Não compareceu';
      default:
        return 'Desconhecido';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'consulta':
        return 'Consulta';
      case 'exame':
        return 'Exame';
      case 'plantao':
        return 'Plantão';
      case 'cirurgia':
        return 'Cirurgia';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Filtrar eventos baseado na busca e filtros
  const filteredEvents = useMemo(() => {
    let events = futureEvents;

    // Filtro por busca (título, descrição, local, paciente/hospital)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        (event.patientName && event.patientName.toLowerCase().includes(query)) ||
        (event.hospital && event.hospital.toLowerCase().includes(query))
      );
    }

    // Filtro por local
    if (locationFilter) {
      events = events.filter(event =>
        event.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filtro por tipo de atividade
    if (activityFilter) {
      events = events.filter(event => event.type === activityFilter);
    }

    // Filtro por status
    if (statusFilter) {
      events = events.filter(event => event.status === statusFilter);
    }

    return events;
  }, [searchQuery, locationFilter, activityFilter, statusFilter]);

  // Agrupar eventos por data
  const groupedEvents = useMemo(() => {
    const groups: Record<string, Evento[]> = {};
    
    filteredEvents.forEach(event => {
      const date = event.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });

    return groups;
  }, [filteredEvents]);

  // Ordenar datas
  const sortedDates = Object.keys(groupedEvents).sort();

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setActivityFilter("");
    setStatusFilter("");
  };

  const hasActiveFilters = searchQuery || locationFilter || activityFilter || statusFilter;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/agenda')}
            className="p-2 hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-foreground text-base font-semibold block">Tarefas Futuras</span>
              <span className="text-muted-foreground text-xs">Agenda</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-primary text-xl font-bold tracking-tight">
            NEL<sup className="text-sm">3</sup><span className="text-destructive">+</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Próximos Eventos
            </h1>
            <p className="text-muted-foreground">
              {filteredEvents.length} de {futureEvents.length} eventos • Hoje: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border-border/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-xs"
              >
                <Filter className="w-4 h-4" />
                Filtros
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpar
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="bg-card border border-border/30 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Local
                    </label>
                    <Input
                      placeholder="Hospital, clínica..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Atividade
                    </label>
                    <select
                      value={activityFilter}
                      onChange={(e) => setActivityFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-background border border-border/20 rounded-md focus:border-primary"
                    >
                      <option value="">Todas</option>
                      <option value="consulta">Consulta</option>
                      <option value="exame">Exame</option>
                      <option value="plantao">Plantão</option>
                      <option value="cirurgia">Cirurgia</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-background border border-border/20 rounded-md focus:border-primary"
                    >
                      <option value="">Todos</option>
                      <option value="realizado">Realizado</option>
                      <option value="ocorrendo">Ocorrendo</option>
                      <option value="aberto">Em aberto</option>
                      <option value="nao_compareceu">Não compareceu</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Events List */}
          {sortedDates.length > 0 ? (
            <div className="space-y-6">
              {sortedDates.map((date) => (
                <div key={date} className="space-y-3">
                  {/* Date Header */}
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-card-foreground">
                        {formatDate(date)}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {formatShortDate(date)}
                        {date === currentDate && (
                          <span className="ml-2 text-primary font-medium">• Hoje</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Events for this date */}
                  <div className="space-y-4 ml-11">
                    {groupedEvents[date].map((event) => (
                      <div
                        key={event.id}
                        className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`} />
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm text-primary font-medium">
                                  {event.time}
                                </span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded font-medium ${
                                event.status === 'realizado' ? 'bg-blue-100 text-blue-700' :
                                event.status === 'ocorrendo' ? 'bg-green-100 text-green-700' :
                                event.status === 'aberto' ? 'bg-gray-100 text-gray-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {getStatusText(event.status)}
                              </span>
                            </div>
                            
                            <h3 className="text-base font-semibold text-card-foreground mb-2">
                              {event.title}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                              {event.patientName && (
                                <span>Paciente: {event.patientName}</span>
                              )}
                              {event.hospital && (
                                <span>Hospital: {event.hospital}</span>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 text-muted-foreground hover:text-foreground ml-3"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {hasActiveFilters ? 'Nenhum evento encontrado' : 'Nenhum evento futuro'}
              </h3>
              <p className="text-muted-foreground">
                {hasActiveFilters 
                  ? 'Tente ajustar os filtros aplicados'
                  : 'Não há eventos programados para os próximos dias'
                }
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-4"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          )}
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

export default AgendaFuturas;
