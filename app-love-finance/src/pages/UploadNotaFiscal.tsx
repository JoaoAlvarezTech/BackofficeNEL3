import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Home, Calendar, Wallet, FileText, Menu, Upload, FileText as FileTextIcon, Send, X, Clock, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

type Activity = {
  id: string;
  amount: number;
  title: string;
  receiveInDays: number;
  category: string;
  patientName: string;
  date: string;
};

const UploadNotaFiscal = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedValue, setExtractedValue] = useState("R$ 800,00");
  const [extractedServiceTaker, setExtractedServiceTaker] = useState("X Santa Casa");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get activity data from navigation state
  const activity: Activity = location.state?.activity || {
    id: "1",
    amount: 800,
    title: "Consulta Cardiológica",
    receiveInDays: 30,
    category: "Cardiologia",
    patientName: "Maria Silva",
    date: "30/10/2024"
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Simulate data extraction from the uploaded file
      // In a real application, this would be done by an API
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      toast({
        title: "Arquivo obrigatório",
        description: "Por favor, faça upload da nota fiscal antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate file processing and analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show success modal instead of toast
      setShowSuccessModal(true);
    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro ao enviar a nota fiscal. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConcluir = () => {
    setShowSuccessModal(false);
    navigate('/antecipar/atividades');
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/antecipar/atividades');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-card/50 transition-colors rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-foreground text-base font-semibold block">Upload de Nota Fiscal</span>
            <span className="text-muted-foreground text-xs">{activity.title}</span>
          </div>
        </div>

      </header>

      {/* Content */}
      <div className="px-4 py-6 pb-28">
        {/* Title and Instructions */}
        <div className="text-center mb-8">
          <h2 className="text-foreground text-2xl font-bold mb-2">
            Faça upload de sua Nota Fiscal
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Certifique-se de que a nota fiscal enviada corresponde à atividade que deseja antecipar.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-card/60 border border-border/30 rounded-3xl p-6 mb-6">
          <div className="text-center">
            {/* Upload Button */}
            <Button
              onClick={handleUploadClick}
              variant="outline"
              className="w-full h-16 bg-primary hover:bg-primary/90 text-white border-primary rounded-2xl text-lg font-semibold mb-4"
            >
              <Upload className="w-6 h-6 mr-2" />
              Upload
            </Button>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Document Preview */}
            <div className="relative mx-auto max-w-sm">
              <div className="bg-white border-2 border-border rounded-lg p-4 shadow-sm">
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-foreground rounded-tl"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-foreground rounded-tr"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-foreground rounded-bl"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-foreground rounded-br"></div>
                
                {/* Document content */}
                <div className="relative">
                  <div className="text-center mb-3">
                    <FileTextIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <h3 className="text-foreground font-semibold text-sm">
                      Nota Fiscal de Serviços Eletrônica - NFS-e
                    </h3>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Prefeitura Municipal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Secretaria da Fazenda</span>
                    </div>
                    <div className="border-t border-border/30 my-2"></div>
                    <div className="flex justify-between">
                      <span>PRESTADOR DE SERVIÇO:</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TOMADOR DO SERVIÇO:</span>
                    </div>
                    <div className="border-t border-border/30 my-2"></div>
                    <div className="grid grid-cols-4 gap-1 text-center">
                      <div className="font-medium">Valor Serviço (R$)</div>
                      <div className="font-medium">Base de Cálculo (R$)</div>
                      <div className="font-medium">Alíquota (%)</div>
                      <div className="font-medium">Valor ISS (R$)</div>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center">
                      <div>800,00</div>
                      <div>800,00</div>
                      <div>5,00</div>
                      <div>40,00</div>
                    </div>
                    <div className="border-t border-border/30 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>Valor Total (R$):</span>
                      <span>800,00</span>
                    </div>
                  </div>
                  
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-muted-foreground/20 text-2xl font-bold transform -rotate-45">
                      MODELO
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Data Fields */}
        <div className="space-y-4 mb-8">
          {/* Value Field */}
          <div className="bg-card/60 border border-border/30 rounded-2xl p-4">
            <label className="text-muted-foreground text-sm font-medium mb-2 block">
              Valor
            </label>
            <Input
              value={extractedValue}
              onChange={(e) => setExtractedValue(e.target.value)}
              className="text-foreground font-semibold text-lg border-0 bg-transparent p-0 focus-visible:ring-0"
            />
          </div>

          {/* Service Taker Field */}
          <div className="bg-card/60 border border-border/30 rounded-2xl p-4">
            <label className="text-muted-foreground text-sm font-medium mb-2 block">
              Tomador do serviço
            </label>
            <Input
              value={extractedServiceTaker}
              onChange={(e) => setExtractedServiceTaker(e.target.value)}
              className="text-foreground font-semibold text-lg border-0 bg-transparent p-0 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !uploadedFile}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Enviar
              </div>
            )}
          </Button>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Análise Automática</p>
              <p className="text-sm text-muted-foreground mt-1">
                Nossa IA analisa automaticamente sua nota fiscal e extrai os dados necessários. 
                Após a análise, você receberá uma confirmação e o valor será creditado em sua conta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-foreground hover:text-muted-foreground transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Content */}
          <div className="bg-card border border-border/30 rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl">
            {/* Central Icon */}
            <div className="flex justify-center pt-8 pb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 text-center">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">
                Obrigado!
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Sua Nota Fiscal foi enviada com sucesso, e se encontra em análise, retornaremos o mais breve possível!
              </p>
              
              {/* Action Button */}
              <Button
                onClick={handleConcluir}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Concluir
              </Button>
            </div>
          </div>
        </div>
      )}

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

export default UploadNotaFiscal;
