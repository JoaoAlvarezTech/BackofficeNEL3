import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  HelpCircle,
  Search,
  User,
  Mail,
  Smartphone,
  CreditCard,
  Clock,
  X,
  QrCode
} from "lucide-react";
import { useState, useEffect } from "react";

const PixEnviar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [pixKey, setPixKey] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Dados simulados
  const recentContacts = [
    { name: "Paulo Ricardo", key: "11971981463", type: "phone", lastUsed: "2 dias atrás" },
    { name: "Maria Silva", key: "maria.silva@email.com", type: "email", lastUsed: "1 semana atrás" },
    { name: "João Santos", key: "123.456.789-00", type: "cpf", lastUsed: "3 dias atrás" }
  ];

  // Validação básica de chave PIX
  const validatePixKey = (key: string) => {
    if (!key) return false;
    
    // Email
    if (key.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(key);
    }
    
    // Phone (apenas números)
    if (/^\d+$/.test(key)) {
      return key.length >= 10 && key.length <= 11;
    }
    
    // CPF
    if (key.includes('.')) {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      return cpfRegex.test(key);
    }
    
    // Random key
    if (key.startsWith('pix-')) {
      return key.length >= 8;
    }
    
    return key.length >= 3;
  };

  useEffect(() => {
    setIsValid(validatePixKey(pixKey));
  }, [pixKey]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      navigate('/pix/valor', { state: { pixKey } });
    }
  };

  const selectContact = (contact: { name: string; key: string; type: string }) => {
    setPixKey(contact.key);
    setShowSuggestions(false);
  };

  const clearInput = () => {
    setPixKey("");
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/pix')}
            className="p-2 hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Transferir com Pix</span>
            <span className="text-muted-foreground text-xs">Pagamentos instantâneos</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-primary text-xl font-bold tracking-tight">
            NEL<sup className="text-sm">3</sup><span className="text-destructive">+</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 pb-28 space-y-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Transferir para</h1>
          <p className="text-muted-foreground mb-6">Digite a chave PIX do destinatário</p>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                value={pixKey}
                onChange={(e) => {
                  setPixKey(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(pixKey.length > 0)}
                onKeyPress={handleKeyPress}
                placeholder="Celular, CPF/CNPJ, chave Pix..."
                className="w-full pl-10 pr-12 py-4 text-lg border-2 border-border/30 rounded-xl focus:border-primary focus:ring-0 bg-card"
              />
              {pixKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearInput}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>

          {/* Contatos recentes */}
          {!pixKey && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-card-foreground mb-3">Contatos recentes</h3>
              <div className="space-y-2">
                {recentContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card transition-all duration-300 cursor-pointer"
                    onClick={() => selectContact(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground text-sm">{contact.name}</p>
                        <p className="text-muted-foreground text-xs">{contact.key}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {contact.lastUsed}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            className={`w-full py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
              isValid
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            onClick={() => navigate('/pix/valor', { state: { pixKey } })}
            disabled={!isValid}
          >
            Continuar
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Sua transferência será processada instantaneamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixEnviar;
