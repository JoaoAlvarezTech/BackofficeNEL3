import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Menu,
  Settings,
  HelpCircle,
  Bell,
  Shield,
  LogOut,
  Home,
  Calendar,
  Wallet,
  FileText,
  CreditCard,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Star,
  MessageSquare,
  Info,
  FileText as Document,
  Download,
  Share2,
  QrCode,
  Camera,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Award
} from "lucide-react";
import { useState } from "react";

const MenuPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dados simulados do perfil
  const profileData = {
    name: "Dr. João Alvarez",
    email: "joao.alvarez@nel3.com",
    crm: "12345-SP",
    especialidade: "Cardiologia",
    status: "Ativo",
    ultimoAcesso: "Hoje às 14:30"
  };

  const menuSections = [
    {
      title: "Perfil e Segurança",
      items: [
        {
          id: 1,
          title: "Meu Perfil",
          icon: User,
          description: "Editar informações pessoais",
          action: () => navigate('/profile')
        },
        {
          id: 2,
          title: "Segurança",
          icon: Shield,
          description: "Senha, biometria e 2FA",
          action: () => navigate('/security-settings')
        },
        {
          id: 3,
          title: "Notificações",
          icon: Bell,
          description: "Alertas e lembretes",
          action: () => console.log("Configurar notificações")
        }
      ]
    },
    {
      title: "Suporte e Ajuda",
      items: [
        {
          id: 4,
          title: "Central de Ajuda",
          icon: HelpCircle,
          description: "Perguntas frequentes",
          action: () => console.log("Abrir ajuda")
        },
        {
          id: 5,
          title: "Fale Conosco",
          icon: MessageSquare,
          description: "Suporte ao cliente",
          action: () => console.log("Contatar suporte")
        },
        {
          id: 6,
          title: "Documentos",
          icon: Document,
          description: "Extratos e comprovantes",
          action: () => console.log("Ver documentos")
        }
      ]
    },
    {
      title: "Configurações",
      items: [
        {
          id: 7,
          title: "Preferências",
          icon: Settings,
          description: "Configurações do app",
          action: () => console.log("Configurar app")
        },
        {
          id: 8,
          title: "Privacidade",
          icon: Lock,
          description: "Política de privacidade",
          action: () => console.log("Ver privacidade")
        },
        {
          id: 9,
          title: "Sobre",
          icon: Info,
          description: "Versão e informações",
          action: () => console.log("Ver sobre")
        }
      ]
    }
  ];

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Menu className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Configurações</span>
            <span className="text-muted-foreground text-xs">Perfil e preferências</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-primary text-xl font-bold tracking-tight">
            NEL<sup className="text-sm">3</sup><span className="text-destructive">+</span>
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

      {/* Content */}
      <div className="px-4 py-6 pb-28">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-card border border-border/30 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center border border-primary/30">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">{profileData.name}</h2>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {profileData.crm}
                    </span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {profileData.status}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Último acesso: {profileData.ultimoAcesso}</span>
                <span>{profileData.especialidade}</span>
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          <div className="space-y-6">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        className="bg-card border border-border/30 rounded-xl p-4 cursor-pointer hover:bg-card/60 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-card-foreground">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12 border-border/30 hover:bg-card/60"
                onClick={() => console.log("Compartilhar app")}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <Button
                variant="outline"
                className="h-12 border-border/30 hover:bg-card/60"
                onClick={() => console.log("Avaliar app")}
              >
                <Star className="w-4 h-4 mr-2" />
                Avaliar
              </Button>
            </div>
          </div>

          {/* Logout Section */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <Button
              variant="outline"
              className="w-full h-12 border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair do Sistema
            </Button>
          </div>

          {/* App Version */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              NEL3 MEDS v1.0.0 • © 2024 NEL3 MEDS
            </p>
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

export default MenuPage;
