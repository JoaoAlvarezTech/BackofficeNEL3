import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, CreditCard, Fingerprint, Eye } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometricOption, setShowBiometricOption] = useState(false);
  const { login, loginWithBiometric, biometricAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Create stars only once to prevent movement on re-renders
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }));
  }, []);

  // Verificar se deve mostrar a opção biométrica
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      const isAvailable = await biometricAuth.checkAvailability();
      const isEnabled = biometricAuth.isBiometricEnabledForUser();
      setShowBiometricOption(isAvailable && isEnabled);
    };

    checkBiometricAvailability();
  }, [biometricAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema NEL3 MEDS.",
        });
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    
    try {
      const success = await loginWithBiometric();
      if (success) {
        toast({
          title: "Login biométrico realizado com sucesso!",
          description: "Bem-vindo ao sistema NEL3 MEDS.",
        });
      } else {
        toast({
          title: "Erro no login biométrico",
          description: "Falha na autenticação biométrica. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login biométrico",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBiometricIcon = () => {
    switch (biometricAuth.biometricType) {
      case 'fingerprint':
        return <Fingerprint className="w-5 h-5" />;
      case 'face':
        return <Eye className="w-5 h-5" />;
      default:
        return <Fingerprint className="w-5 h-5" />;
    }
  };

  const getBiometricText = () => {
    switch (biometricAuth.biometricType) {
      case 'fingerprint':
        return 'Login com Digital';
      case 'face':
        return 'Login com Face ID';
      default:
        return 'Login Biométrico';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: star.left,
              top: star.top
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-6xl font-bold text-cyan-400">NEL</span>
            <span className="text-3xl font-bold text-cyan-400 align-top">³</span>
            <span className="text-2xl font-bold text-red-500 align-top ml-1">+</span>
          </div>
          <h2 className="text-2xl font-light text-white tracking-[0.4em]">HEALTH</h2>
        </div>

        {/* Welcome message */}
        <p className="text-white text-xl mb-12">Bem-vindo(a) Nel³ Meds!</p>

        {/* Doctor illustration */}
        <div className="relative mb-12">
          <div className="w-48 h-48 mx-auto relative">
            <img 
              src="/logos/Médico - Login.png" 
              alt="Médico" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Floating icons */}
          <div className="absolute -top-6 -left-6">
            <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="absolute -top-6 -right-6">
            <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6">
            <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Biometric login option */}
        {showBiometricOption && (
          <div className="w-full max-w-sm mb-6">
            <Button 
              type="button"
              onClick={handleBiometricLogin}
              disabled={isLoading || biometricAuth.isLoading}
              className="w-full h-14 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {getBiometricIcon()}
              {biometricAuth.isLoading ? "Autenticando..." : getBiometricText()}
            </Button>
            
            <div className="text-center mt-3">
              <span className="text-gray-300 text-sm">ou</span>
            </div>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 bg-white text-gray-900 placeholder:text-gray-500 border-0 rounded-xl text-center shadow-lg"
            />
            
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-14 bg-white text-gray-900 placeholder:text-gray-500 border-0 rounded-xl text-center shadow-lg"
            />
          </div>

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-cyan-400 hover:bg-cyan-500 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Footer links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-white">
            Ainda não possui cadastro?{" "}
            <button 
              type="button" 
              className="text-cyan-400 hover:text-cyan-300 font-medium"
              onClick={() => navigate('/register')}
            >
              Crie uma conta
            </button>
          </p>
          <button 
            type="button" 
            className="text-cyan-400 hover:text-cyan-300 font-medium"
            onClick={() => navigate('/forgot-password')}
          >
            Esqueceu sua senha?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;