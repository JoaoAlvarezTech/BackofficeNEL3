
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  Check,
  X,
  AlertCircle,
  Plus,
  MoreVertical,
  Home,
  Wallet,
  FileText,
  Menu,
  Star,
  User,
  ArrowRight,
  Gift,
  Eye,
  Edit,
  Trash2,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";

interface PlantaoData {
  id: number;
  tipo: string;
  data: string;
  horario: string;
  local: string;
  especialidade: string;
  status: string;
  prioridade: string;
  observacoes?: string;
  ofertante?: string;
  motivo?: string;
}

interface ModalData {
  title?: string;
  message?: string;
  onConfirm?: () => void;
  plantao?: PlantaoData;
  icon?: string;
}

const AgendaTrocas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'oferecer' | 'disponiveis'>('oferecer');
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [showOptionsDisponivel, setShowOptionsDisponivel] = useState<number | null>(null);
  
  // Estados para modais
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [modalType, setModalType] = useState<'success' | 'confirm' | 'details'>('success');

  // Dados simulados dos plantões do médico atual
  const [meusPlantões, setMeusPlantões] = useState<PlantaoData[]>([]);

  // Dados simulados de plantões disponíveis de outros médicos
  const [plantõesDisponiveis, setPlantõesDisponiveis] = useState<PlantaoData[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedMeusPlantões = localStorage.getItem('meus_plantões');
    const savedPlantõesDisponiveis = localStorage.getItem('plantões_disponiveis');

    if (savedMeusPlantões) {
      setMeusPlantões(JSON.parse(savedMeusPlantões));
    } else {
      // Dados iniciais dos meus plantões
      const initialMeusPlantões: PlantaoData[] = [
        {
          id: 1,
          tipo: "plantao",
          data: "2025-01-25",
          horario: "18:00-06:00",
          local: "Santa Casa",
          especialidade: "Cardiologia",
          status: "disponivel",
          prioridade: "alta",
          observacoes: "Plantão noturno de emergência"
        },
        {
          id: 2,
          tipo: "consulta",
          data: "2025-01-28",
          horario: "14:00-17:00",
          local: "Clínica Central",
          especialidade: "Cardiologia",
          status: "disponivel",
          prioridade: "média",
          observacoes: "Consultas ambulatoriais"
        },
        {
          id: 3,
          tipo: "plantao",
          data: "2025-02-01",
          horario: "08:00-18:00",
          local: "Hospital Municipal",
          especialidade: "Cardiologia",
          status: "disponivel",
          prioridade: "baixa",
          observacoes: "Plantão diurno"
        }
      ];
      setMeusPlantões(initialMeusPlantões);
      localStorage.setItem('meus_plantões', JSON.stringify(initialMeusPlantões));
    }

    if (savedPlantõesDisponiveis) {
      setPlantõesDisponiveis(JSON.parse(savedPlantõesDisponiveis));
    } else {
      // Dados iniciais de plantões disponíveis
      const initialPlantõesDisponiveis: PlantaoData[] = [
        {
          id: 101,
          tipo: "plantao",
          data: "2025-01-26",
          horario: "18:00-06:00",
          local: "Santa Casa",
          especialidade: "Neurologia",
          ofertante: "Dr. João Santos",
          prioridade: "alta",
          motivo: "Compromisso familiar urgente",
          status: "disponivel"
        },
        {
          id: 102,
          tipo: "consulta",
          data: "2025-01-29",
          horario: "09:00-12:00",
          local: "Clínica Especializada",
          especialidade: "Dermatologia",
          ofertante: "Dra. Ana Costa",
          prioridade: "média",
          motivo: "Congresso médico",
          status: "disponivel"
        },
        {
          id: 103,
          tipo: "plantao",
          data: "2025-02-02",
          horario: "08:00-18:00",
          local: "Hospital Regional",
          especialidade: "Ortopedia",
          ofertante: "Dr. Carlos Lima",
          prioridade: "baixa",
          motivo: "Viagem pessoal",
          status: "disponivel"
        }
      ];
      setPlantõesDisponiveis(initialPlantõesDisponiveis);
      localStorage.setItem('plantões_disponiveis', JSON.stringify(initialPlantõesDisponiveis));
    }
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('meus_plantões', JSON.stringify(meusPlantões));
  }, [meusPlantões]);

  useEffect(() => {
    localStorage.setItem('plantões_disponiveis', JSON.stringify(plantõesDisponiveis));
  }, [plantõesDisponiveis]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'aceito':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelado':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'aceito':
        return 'Aceito';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'text-red-500';
      case 'média':
        return 'text-yellow-500';
      case 'baixa':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'plantao':
        return 'bg-orange-500';
      case 'consulta':
        return 'bg-blue-500';
      case 'exame':
        return 'bg-green-500';
      case 'cirurgia':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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

  const showModal = (type: 'success' | 'confirm' | 'details', data?: ModalData) => {
    setModalType(type);
    setModalData(data);
    if (type === 'success') {
      setShowSuccessModal(true);
    } else if (type === 'confirm') {
      setShowConfirmModal(true);
    } else if (type === 'details') {
      setShowDetailsModal(true);
    }
  };

  const handleOferecerPlantao = (id: number) => {
    const plantao = meusPlantões.find(p => p.id === id);
    if (plantao) {
      // Mover plantão de "meus plantões" para "plantões disponíveis"
      const plantaoParaOferecer: PlantaoData = {
        ...plantao,
        id: Date.now(), // Novo ID para evitar conflitos
        ofertante: user?.name || "Dr. Usuário",
        motivo: "Disponível para troca",
        status: "disponivel"
      };

      setMeusPlantões(prev => prev.filter(p => p.id !== id));
      setPlantõesDisponiveis(prev => [plantaoParaOferecer, ...prev]);
      
      showModal('success', {
        title: 'Plantão Oferecido!',
        message: 'Seu plantão foi oferecido com sucesso! Outros médicos poderão vê-lo na aba "Disponíveis".',
        icon: 'success'
      });
    }
  };

  const handleAceitarPlantao = (id: number) => {
    const plantao = plantõesDisponiveis.find(p => p.id === id);
    if (plantao) {
      // Mover plantão de "plantões disponíveis" para "meus plantões"
      const plantaoParaAceitar: PlantaoData = {
        ...plantao,
        id: Date.now(), // Novo ID para evitar conflitos
        status: 'aceito',
        observacoes: `Aceito de ${plantao.ofertante}`,
        ofertante: undefined,
        motivo: undefined
      };

      setPlantõesDisponiveis(prev => prev.filter(p => p.id !== id));
      setMeusPlantões(prev => [plantaoParaAceitar, ...prev]);
      
      showModal('success', {
        title: 'Plantão Aceito!',
        message: 'Plantão aceito com sucesso! Adicionado ao seu calendário.',
        icon: 'success'
      });
    }
  };

  const handleCancelarOferta = (id: number) => {
    const plantao = meusPlantões.find(p => p.id === id);
    if (plantao) {
      // Remover plantão da lista de disponíveis e voltar para meus plantões
      setMeusPlantões(prev => prev.map(p => 
        p.id === id 
          ? { ...p, status: 'disponivel' }
          : p
      ));
      
      showModal('success', {
        title: 'Oferta Cancelada!',
        message: 'Oferta cancelada com sucesso! O plantão voltou para seu calendário.',
        icon: 'success'
      });
    }
  };

  const handleEditarPlantao = (id: number) => {
    showModal('success', {
      title: 'Em Desenvolvimento',
      message: 'Funcionalidade de edição será implementada em breve!',
      icon: 'info'
    });
  };

  const handleExcluirPlantao = (id: number) => {
    showModal('confirm', {
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este plantão?',
      onConfirm: () => {
        setMeusPlantões(prev => prev.filter(plantao => plantao.id !== id));
        setShowConfirmModal(false);
        showModal('success', {
          title: 'Plantão Excluído!',
          message: 'Plantão excluído com sucesso!',
          icon: 'success'
        });
      }
    });
  };

  const handleContatarOfertante = (ofertante: string) => {
    showModal('success', {
      title: 'Em Desenvolvimento',
      message: `Funcionalidade de contato será implementada em breve!\n\nOfertante: ${ofertante}`,
      icon: 'info'
    });
  };

  const handleVerDetalhes = (plantao: PlantaoData) => {
    showModal('details', {
      title: 'Detalhes do Plantão',
      plantao: plantao
    });
  };

  const handleFiltrarPorEspecialidade = () => {
    showModal('success', {
      title: 'Em Desenvolvimento',
      message: 'Funcionalidade de filtro será implementada em breve!',
      icon: 'info'
    });
  };

  const handleOrdenarPorData = () => {
    showModal('success', {
      title: 'Em Desenvolvimento',
      message: 'Funcionalidade de ordenação será implementada em breve!',
      icon: 'info'
    });
  };

  // Componente Modal de Sucesso
  const SuccessModal = () => (
    showSuccessModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border/30 rounded-xl p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {modalData?.title}
            </h3>
            <p className="text-muted-foreground mb-6 whitespace-pre-line">
              {modalData?.message}
            </p>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl"
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    )
  );

  // Componente Modal de Confirmação
  const ConfirmModal = () => (
    showConfirmModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border/30 rounded-xl p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {modalData?.title}
            </h3>
            <p className="text-muted-foreground mb-6">
              {modalData?.message}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border-border/30 hover:bg-card/60 text-card-foreground py-3 rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  modalData?.onConfirm?.();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Componente Modal de Detalhes
  const DetailsModal = () => (
    showDetailsModal && modalData?.plantao && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border/30 rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {modalData.title}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-card/60 border border-border/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getTipoColor(modalData.plantao.tipo)}`} />
                <span className="text-sm font-medium text-card-foreground capitalize">
                  {modalData.plantao.tipo}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {modalData.plantao.especialidade} • {modalData.plantao.local}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card/60 border border-border/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-card-foreground">Data</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(modalData.plantao.data)}
                </p>
              </div>

              <div className="bg-card/60 border border-border/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-card-foreground">Horário</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {modalData.plantao.horario}
                </p>
              </div>
            </div>

            {modalData.plantao.ofertante && (
              <div className="bg-card/60 border border-border/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-card-foreground">Ofertante</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {modalData.plantao.ofertante}
                </p>
              </div>
            )}

            {modalData.plantao.motivo && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-card-foreground">Motivo</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {modalData.plantao.motivo}
                </p>
              </div>
            )}

            {modalData.plantao.observacoes && (
              <div className="bg-muted/30 border border-border/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-card-foreground">Observações</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {modalData.plantao.observacoes}
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowDetailsModal(false)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl mt-6"
          >
            Fechar
          </Button>
        </div>
      </div>
    )
  );

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
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-foreground text-base font-semibold block">Troca de Escalas</span>
              <span className="text-muted-foreground text-xs">Compartilhe seus plantões</span>
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
              Troca de Escalas
            </h1>
            <p className="text-muted-foreground mb-4">
              Ofereça seus plantões ou aceite plantões disponíveis de outros médicos
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-muted/20 rounded-xl p-1 mb-6">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'oferecer'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('oferecer')}
            >
              <Gift className="w-4 h-4" />
              Meus Plantões ({meusPlantões.length})
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'disponiveis'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('disponiveis')}
            >
              <Eye className="w-4 h-4" />
              Disponíveis ({plantõesDisponiveis.length})
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'oferecer' ? (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Como funciona</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ofereça seus plantões para que outros médicos possam aceitá-los. Você pode cancelar a oferta a qualquer momento.
                    </p>
                  </div>
                </div>
              </div>

              {meusPlantões.length > 0 ? (
                meusPlantões.map((plantao) => (
                  <div
                    key={plantao.id}
                    className="bg-card border border-border/30 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getTipoColor(plantao.tipo)}`} />
                        <div>
                          <h3 className="text-lg font-semibold text-card-foreground capitalize">
                            {plantao.tipo}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {plantao.especialidade} • {plantao.local}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(plantao.status)}`}>
                          {getStatusText(plantao.status)}
                        </span>
                        {plantao.prioridade === 'alta' && (
                          <Star className="w-4 h-4 text-red-500 fill-current" />
                        )}
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowOptions(showOptions === plantao.id ? null : plantao.id)}
                            className="p-1 text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          {showOptions === plantao.id && (
                            <div className="absolute right-0 top-8 bg-card border border-border/30 rounded-lg shadow-lg z-10 min-w-[150px]">
                              <button
                                onClick={() => {
                                  handleEditarPlantao(plantao.id);
                                  setShowOptions(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  handleExcluirPlantao(plantao.id);
                                  setShowOptions(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-card-foreground">Data</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(plantao.data)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatShortDate(plantao.data)}
                        </p>
                      </div>

                      <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-card-foreground">Horário</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {plantao.horario}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {plantao.local}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-card-foreground">Prioridade:</span>
                        <span className={`text-sm font-medium ${getPriorityColor(plantao.prioridade)}`}>
                          {plantao.prioridade.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {plantao.observacoes && (
                      <div className="bg-muted/30 border border-border/30 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-card-foreground">Observações</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {plantao.observacoes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {plantao.status === 'disponivel' ? (
                        <Button
                          onClick={() => handleOferecerPlantao(plantao.id)}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Gift className="w-4 h-4" />
                          Oferecer Plantão
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleCancelarOferta(plantao.id)}
                          variant="outline"
                          className="flex-1 border-red-300 hover:bg-red-50 text-red-600 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancelar Oferta
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => handleVerDetalhes(plantao)}
                        className="flex-1 border-border/30 hover:bg-card/60 text-card-foreground py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    Nenhum plantão disponível
                  </h3>
                  <p className="text-muted-foreground">
                    Você não tem plantões para oferecer no momento
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Plantões disponíveis</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Aceite plantões oferecidos por outros médicos para adicionar ao seu calendário.
                    </p>
                  </div>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFiltrarPorEspecialidade}
                  className="text-xs border-border/30 hover:bg-card/60"
                >
                  Filtrar por Especialidade
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOrdenarPorData}
                  className="text-xs border-border/30 hover:bg-card/60"
                >
                  Ordenar por Data
                </Button>
              </div>

              {plantõesDisponiveis.length > 0 ? (
                <div className="space-y-4">
                  {plantõesDisponiveis.map((plantao) => (
                    <div
                      key={plantao.id}
                      className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                    >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getTipoColor(plantao.tipo)}`} />
                        <div>
                          <h3 className="text-lg font-semibold text-card-foreground capitalize">
                            {plantao.tipo}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {plantao.especialidade} • {plantao.local}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(plantao.status)}`}>
                          {getStatusText(plantao.status)}
                        </span>
                        {plantao.prioridade === 'alta' && (
                          <Star className="w-4 h-4 text-red-500 fill-current" />
                        )}
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowOptionsDisponivel(showOptionsDisponivel === plantao.id ? null : plantao.id)}
                            className="p-1 text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          {showOptionsDisponivel === plantao.id && (
                            <div className="absolute right-0 top-8 bg-card border border-border/30 rounded-lg shadow-lg z-10 min-w-[150px]">
                              <button
                                onClick={() => {
                                  handleContatarOfertante(plantao.ofertante || '');
                                  setShowOptionsDisponivel(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Contatar
                              </button>
                              <button
                                onClick={() => {
                                  handleVerDetalhes(plantao);
                                  setShowOptionsDisponivel(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Ver Detalhes
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-card-foreground">Data</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(plantao.data)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatShortDate(plantao.data)}
                        </p>
                      </div>

                      <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-card-foreground">Horário</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {plantao.horario}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {plantao.local}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-card-foreground">Ofertante:</span>
                        <span className="text-sm text-muted-foreground">{plantao.ofertante}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-card-foreground">Prioridade:</span>
                        <span className={`text-sm font-medium ${getPriorityColor(plantao.prioridade)}`}>
                          {plantao.prioridade.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-card-foreground">Motivo da oferta</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {plantao.motivo}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleAceitarPlantao(plantao.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Aceitar Plantão
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleContatarOfertante(plantao.ofertante || '')}
                        className="flex-1 border-border/30 hover:bg-card/60 text-card-foreground py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Contatar
                      </Button>
                    </div>
                  </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    Nenhum plantão disponível
                  </h3>
                  <p className="text-muted-foreground">
                    Não há plantões sendo oferecidos por outros médicos no momento
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      <SuccessModal />
      <ConfirmModal />
      <DetailsModal />

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

export default AgendaTrocas;
