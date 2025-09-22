import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, CreditCard } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate password reset process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSent(true);
      toast({
        title: "Email enviado com sucesso!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <p className="text-white text-xl mb-12">Esqueceu sua senha?</p>

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

        {!isSent ? (
          <>
            {/* Instructions */}
            <p className="text-white text-center mb-8 max-w-sm">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>

            {/* Reset form */}
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
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-cyan-400 hover:bg-cyan-500 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          </>
        ) : (
          <>
            {/* Success message */}
            <div className="w-full max-w-sm text-center space-y-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white text-xl font-semibold">Email enviado!</h3>
                <p className="text-gray-300 text-sm">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
              </div>

              <Button 
                onClick={() => navigate('/')}
                className="w-full h-14 bg-cyan-400 hover:bg-cyan-500 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Voltar ao login
              </Button>
            </div>
          </>
        )}

        {/* Footer links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-white">
            Lembrou sua senha?{" "}
            <button 
              type="button" 
              className="text-cyan-400 hover:text-cyan-300 font-medium"
              onClick={() => navigate('/')}
            >
              Faça login
            </button>
          </p>
          <button 
            type="button" 
            className="text-cyan-400 hover:text-cyan-300 font-medium"
            onClick={() => navigate('/register')}
          >
            Criar nova conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
