import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  FileText
} from "lucide-react";
import { useState } from "react";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dados simulados do perfil
  const [profileData, setProfileData] = useState({
    name: "Dr. João Alvarez",
    email: "joao.alvarez@nel3.com",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    crm: "12345-SP",
    especialidade: "Cardiologia",
    endereco: "São Paulo, SP",
    dataNascimento: "15/03/1985",
    status: "Ativo",
    ultimoAcesso: "Hoje às 14:30",
    contaBanco: "Banco NEL3 - Ag: 1234 - CC: 12345-6"
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aqui você salvaria os dados
    console.log("Dados salvos:", profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Aqui você restauraria os dados originais
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/menu')}
            className="p-2 hover:bg-card/60"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Meu Perfil</span>
            <span className="text-muted-foreground text-xs">Informações pessoais</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="text-foreground border-border hover:bg-card hover:text-foreground"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                className="text-muted-foreground border-border hover:bg-card"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 pb-28">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Profile Photo Section */}
          <div className="bg-card border border-border/30 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center border border-primary/30">
                  <User className="w-12 h-12 text-primary" />
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-card-foreground mb-1">{profileData.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{profileData.especialidade}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {profileData.crm}
                  </span>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    {profileData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-card border border-border/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informações Pessoais
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-background border border-border/30 rounded-lg text-card-foreground">
                      {profileData.name}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">E-mail</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-background border border-border/30 rounded-lg text-card-foreground">
                      {profileData.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-background border border-border/30 rounded-lg text-card-foreground">
                      {profileData.phone}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="cpf" className="text-sm font-medium text-muted-foreground">CPF</Label>
                  <div className="mt-1 p-3 bg-muted border border-border/30 rounded-lg text-muted-foreground">
                    {profileData.cpf}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endereco" className="text-sm font-medium text-muted-foreground">Endereço</Label>
                  {isEditing ? (
                    <Input
                      id="endereco"
                      value={profileData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-background border border-border/30 rounded-lg text-card-foreground">
                      {profileData.endereco}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="dataNascimento" className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
                  <div className="mt-1 p-3 bg-muted border border-border/30 rounded-lg text-muted-foreground">
                    {profileData.dataNascimento}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-card border border-border/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Informações Profissionais
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crm" className="text-sm font-medium text-muted-foreground">CRM</Label>
                  <div className="mt-1 p-3 bg-muted border border-border/30 rounded-lg text-muted-foreground">
                    {profileData.crm}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="especialidade" className="text-sm font-medium text-muted-foreground">Especialidade</Label>
                  {isEditing ? (
                    <Input
                      id="especialidade"
                      value={profileData.especialidade}
                      onChange={(e) => handleInputChange('especialidade', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-background border border-border/30 rounded-lg text-card-foreground">
                      {profileData.especialidade}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-card border border-border/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Informações da Conta
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Conta Bancária</Label>
                <div className="mt-1 p-3 bg-background border border-border/30 rounded-lg text-card-foreground">
                  {profileData.contaBanco}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status da Conta</Label>
                  <div className="mt-1 p-3 bg-background border border-border/30 rounded-lg">
                    <span className="inline-flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Verificada
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Último Acesso</Label>
                  <div className="mt-1 p-3 bg-background border border-border/30 rounded-lg text-card-foreground">
                    {profileData.ultimoAcesso}
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Activity Summary */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Resumo de Atividades
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-background/50 rounded-lg border border-border/30">
                <div className="text-2xl font-bold text-primary">R$ 45.250,00</div>
                <div className="text-sm text-muted-foreground">Total Antecipado</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg border border-border/30">
                <div className="text-2xl font-bold text-primary">23</div>
                <div className="text-sm text-muted-foreground">Transações</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;