import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockdb, Partner, PartnerStatus, KycStatus } from "@/lib/mockdb";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { validateCNPJ } from "@/lib/validators";

export default function PartnersEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<PartnerStatus>("active");
  const [kycStatus, setKycStatus] = useState<KycStatus>("pending");
  const [volumeMonthly, setVolumeMonthly] = useState<number>(0);
  const [contracts, setContracts] = useState<number>(0);
  const [affiliatesCount, setAffiliatesCount] = useState<number>(0);
  
  const [partner, setPartner] = useState<Partner | null>(null);

  useEffect(() => {
    if (!id) {
      toast.error("ID do partner não fornecido");
      navigate("/partners");
      return;
    }

    try {
      // Load partner
      const foundPartner = mockdb.getPartner(id);
      
      if (!foundPartner) {
        toast.error("Partner não encontrado");
        navigate("/partners");
        return;
      }

      setPartner(foundPartner);
      setName(foundPartner.name);
      setCnpj(foundPartner.cnpj);
      setCity(foundPartner.city || "");
      setStatus(foundPartner.status);
      setKycStatus(foundPartner.kycStatus);
      setVolumeMonthly(foundPartner.volumeMonthly || 0);
      setContracts(foundPartner.contracts || 0);
      setAffiliatesCount(foundPartner.affiliatesCount || 0);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading partner:', error);
      toast.error("Erro ao carregar dados do partner");
      navigate("/partners");
    }
  }, [id, navigate]);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return false;
    }
    if (!cnpj || !validateCNPJ(cnpj)) {
      toast.error("CNPJ inválido");
      return false;
    }
    if (!city.trim()) {
      toast.error("Cidade é obrigatória");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!partner) {
      toast.error("Dados do partner não encontrados");
      return;
    }
    
    setSaving(true);
    
    try {
      console.log('Updating partner with data:', {
        id: partner.id,
        name: name.trim(),
        cnpj,
        city: city.trim(),
        status,
        kycStatus,
        volumeMonthly,
        contracts,
        affiliatesCount
      });
      
      // Update partner using upsertPartner
      const updatedPartner = mockdb.upsertPartner({
        id: partner.id,
        name: name.trim(),
        cnpj,
        city: city.trim(),
        status,
        kycStatus,
        volumeMonthly,
        contracts,
        affiliatesCount,
        documents: partner.documents || []
      });

      console.log('Partner updated successfully:', updatedPartner);
      
      // Create notification
      try {
        mockdb.createNotification({
          type: 'kyc',
          title: 'Partner Atualizado',
          message: `${name} - Informações do partner foram atualizadas`,
          priority: 'medium',
          partnerId: partner.id,
          actionUrl: '/partners'
        });
        console.log('Notification created successfully');
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        // Continue even if notification fails
      }
      
      toast.success(`Partner "${name}" atualizado com sucesso!`, {
        description: "Redirecionando para a lista de partners..."
      });
      
      // Small delay to show the toast
      setTimeout(() => {
        navigate("/partners");
      }, 1500);
      
    } catch (error) {
      console.error('Error updating partner:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error("Erro ao atualizar partner", {
        description: errorMessage
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados do partner...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Partner não encontrado</p>
        <Button onClick={() => navigate("/partners")} className="mt-4">
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/partners")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Partner</h1>
          <p className="text-muted-foreground">Atualize as informações do hospital/clínica</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Hospital/Clínica *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da instituição"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cidade"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as PartnerStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kycStatus">Status KYC</Label>
                <Select value={kycStatus} onValueChange={(v) => setKycStatus(v as KycStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status KYC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="under_review">Em Análise</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="volumeMonthly">Volume Mensal (R$)</Label>
                <Input
                  id="volumeMonthly"
                  type="number"
                  value={volumeMonthly}
                  onChange={(e) => setVolumeMonthly(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contracts">Número de Contratos</Label>
                <Input
                  id="contracts"
                  type="number"
                  value={contracts}
                  onChange={(e) => setContracts(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="affiliatesCount">Número de Usuários</Label>
                <Input
                  id="affiliatesCount"
                  type="number"
                  value={affiliatesCount}
                  onChange={(e) => setAffiliatesCount(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/partners")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-gradient-primary">
                {saving ? (
                  <>
                    <Building2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

