import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { PixKeysProvider } from "@/contexts/PixKeysContext";
import { AnticipationProvider } from "@/contexts/AnticipationContext";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import Index from "./pages/Index";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import SimuladorAntecipacao from "./pages/SimuladorAntecipacao";
import UploadNotaFiscal from "./pages/UploadNotaFiscal";
import AntecipacoesEmProcesso from "./pages/AntecipacoesEmProcesso";
import HistoricoAntecipacoes from "./pages/HistoricoAntecipacoes";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import AgendaFuturas from "./pages/AgendaFuturas";
import AgendaTrocas from "./pages/AgendaTrocas";
import Carteira from "./pages/Carteira";
import Historico from "./pages/Historico";
import MenuPage from "./pages/Menu";
import ProfilePage from "./pages/Profile";
import Antecipar from "./pages/Antecipar";
import AtividadesAntecipacao from "./pages/AtividadesAntecipacao";
import Pix from "./pages/Pix";
import PixEnviar from "./pages/PixEnviar";
import PixValor from "./pages/PixValor";
import PixConfirmar from "./pages/PixConfirmar";
import PixSenha from "./pages/PixSenha";
import PixSucesso from "./pages/PixSucesso";
import NotFound from "./pages/NotFound";
import PixReceber from "./pages/PixReceber";
import PixQrCode from "./pages/PixQrCode";
import PixRecebido from "./pages/PixRecebido";
import PixGerenciarChaves from "./pages/PixGerenciarChaves";
import Boleto from "./pages/Boleto";
import SecuritySettings from "./pages/SecuritySettings";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={
      <PublicRoute>
        <Index />
      </PublicRoute>
    } />
    <Route path="/register" element={
      <PublicRoute>
        <Register />
      </PublicRoute>
    } />
    <Route path="/forgot-password" element={
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    } />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/agenda" element={
      <ProtectedRoute>
        <Agenda />
      </ProtectedRoute>
    } />
    <Route path="/agenda/futuras" element={
      <ProtectedRoute>
        <AgendaFuturas />
      </ProtectedRoute>
    } />
    <Route path="/agenda/trocas" element={
      <ProtectedRoute>
        <AgendaTrocas />
      </ProtectedRoute>
    } />
    <Route path="/carteira" element={
      <ProtectedRoute>
        <Carteira />
      </ProtectedRoute>
    } />
    <Route path="/historico" element={
      <ProtectedRoute>
        <Historico />
      </ProtectedRoute>
    } />
    <Route path="/menu" element={
      <ProtectedRoute>
        <MenuPage />
      </ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    } />
    <Route path="/antecipar" element={
      <ProtectedRoute>
        <Antecipar />
      </ProtectedRoute>
    } />
    <Route path="/antecipar/atividades" element={
      <ProtectedRoute>
        <AtividadesAntecipacao />
      </ProtectedRoute>
    } />
    <Route path="/antecipar/simulador" element={
      <ProtectedRoute>
        <SimuladorAntecipacao />
      </ProtectedRoute>
    } />
    <Route path="/antecipar/upload" element={
      <ProtectedRoute>
        <UploadNotaFiscal />
      </ProtectedRoute>
    } />
    <Route path="/antecipar/processo" element={
      <ProtectedRoute>
        <AntecipacoesEmProcesso />
      </ProtectedRoute>
    } />
    <Route path="/antecipar/historico" element={
      <ProtectedRoute>
        <HistoricoAntecipacoes />
      </ProtectedRoute>
    } />
    <Route path="/pix" element={
      <ProtectedRoute>
        <Pix />
      </ProtectedRoute>
    } />
    <Route path="/pix/enviar" element={
      <ProtectedRoute>
        <PixEnviar />
      </ProtectedRoute>
    } />
    <Route path="/pix/valor" element={
      <ProtectedRoute>
        <PixValor />
      </ProtectedRoute>
    } />
    <Route path="/pix/confirmar" element={
      <ProtectedRoute>
        <PixConfirmar />
      </ProtectedRoute>
    } />
    <Route path="/pix/senha" element={
      <ProtectedRoute>
        <PixSenha />
      </ProtectedRoute>
    } />
    <Route path="/pix/sucesso" element={
      <ProtectedRoute>
        <PixSucesso />
      </ProtectedRoute>
    } />
    <Route path="/pix/receber" element={
      <ProtectedRoute>
        <PixReceber />
      </ProtectedRoute>
    } />
    <Route path="/pix/qrcode" element={
      <ProtectedRoute>
        <PixQrCode />
      </ProtectedRoute>
    } />
    <Route path="/pix/recebido" element={
      <ProtectedRoute>
        <PixRecebido />
      </ProtectedRoute>
    } />
    <Route path="/pix/gerenciar-chaves" element={
      <ProtectedRoute>
        <PixGerenciarChaves />
      </ProtectedRoute>
    } />
    <Route path="/boleto" element={
      <ProtectedRoute>
        <Boleto />
      </ProtectedRoute>
    } />
    <Route path="/security-settings" element={
      <ProtectedRoute>
        <SecuritySettings />
      </ProtectedRoute>
    } />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
                <AuthProvider>
              <BalanceProvider>
                <PixKeysProvider>
                  <AnticipationProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <BrowserRouter>
                        <AppRoutes />
                        <PWAInstallPrompt />
                      </BrowserRouter>
                    </TooltipProvider>
                  </AnticipationProvider>
                </PixKeysProvider>
              </BalanceProvider>
            </AuthProvider>
  </QueryClientProvider>
);

export default App;
