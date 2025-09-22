import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockdb, Affiliate, Partner, PartnerStatus, KycStatus } from "@/lib/mockdb";
import { ArrowLeft, Save, Building } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { validateCNPJ } from "@/lib/validators";

export default function AffiliatesEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cpf, setCpf] = useState("");
  const [crm, setCrm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<PartnerStatus>("active");
  const [kycStatus, setKycStatus] = useState<KycStatus>("approved");
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  
  // Available partners
  const [partners, setPartners] = useState<Partner[]>([]);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);

  useEffect(() => {
    if (!id) {
      toast.error("ID do usuário não fornecido");
      navigate("/affiliates");
      return;
    }

    try {
      // Load partners
      const partnersList = mockdb.listPartners() || [];
      setPartners(partnersList);

      // Load affiliate
      const affiliatesList = mockdb.listAffiliates() || [];
      const foundAffiliate = affiliatesList.find(a => a.id === id);
      
      if (!foundAffiliate) {
        toast.error("Usuário não encontrado");
        navigate("/affiliates");
        return;
      }

      setAffiliate(foundAffiliate);
      setName(foundAffiliate.name);
      setCnpj(foundAffiliate.cnpj);
      setCpf(foundAffiliate.cpf || "");
      setCrm(foundAffiliate.crm || "");
      setSpecialty(foundAffiliate.specialty || "");
      setEmail(foundAffiliate.email || "");
      setPhone(foundAffiliate.phone || "");
      setCity(foundAffiliate.city);
      setAddress(foundAffiliate.address || "");
      setStatus(foundAffiliate.status);
      setKycStatus(foundAffiliate.kycStatus);
      setSelectedPartnerIds(foundAffiliate.associatedPartnerIds);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading affiliate:', error);
      toast.error("Erro ao carregar dados do usuário");
      navigate("/affiliates");
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
    if (selectedPartnerIds.length === 0) {
      toast.error("Selecione pelo menos um partner");
      return false;
    }
    return true;
  };

  const handlePartnerToggle = (partnerId: string, checked: boolean) => {
    if (checked) {
      setSelectedPartnerIds(prev => [...prev, partnerId]);
    } else {
      setSelectedPartnerIds(prev => prev.filter(id => id !== partnerId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!affiliate) {
      toast.error("Dados do usuário não encontrados");
      return;
    }
    
    setSaving(true);
    
    try {
      console.log('Updating affiliate with data:', {
        id: affiliate.id,
        name: name.trim(),
        cnpj,
        cpf,
        crm,
        specialty,
        email,
        phone,
        city: city.trim(),
        address: address.trim() || undefined,
        status,
        kycStatus,
        associatedPartnerIds: selectedPartnerIds
      });
      
      // Update affiliate using upsertAffiliate
      const updatedAffiliate = mockdb.upsertAffiliate({
        id: affiliate.id,
        name: name.trim(),
        cnpj,
        cpf,
        crm,
        specialty,
        email,
        phone,
        city: city.trim(),
        address: address.trim() || undefined,
        status,
        kycStatus,
        associatedPartnerIds: selectedPartnerIds
      });

      console.log('Affiliate updated successfully:', updatedAffiliate);
      
      // Create notification
      try {
        mockdb.createNotification({
          type: 'kyc',
          title: 'Usuário Atualizado',
          message: `${name} - Informações do usuário foram atualizadas`,
          priority: 'medium',
          affiliateId: affiliate.id,
          actionUrl: '/affiliates'
        });
        console.log('Notification created successfully');
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        // Continue even if notification fails
      }
      
      toast.success(`Usuário "${name}" atualizado com sucesso!`, {
        description: "Redirecionando para a lista de usuários..."
      });
      
      // Small delay to show the toast
      setTimeout(() => {
        navigate("/affiliates");
      }, 1500);
      
    } catch (error) {
      console.error('Error updating affiliate:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error("Erro ao atualizar usuário", {
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
          <Building className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Usuário não encontrado</p>
        <Button onClick={() => navigate("/affiliates")} className="mt-4">
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/affiliates")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Usuário</h1>
          <p className="text-muted-foreground">Atualize as informações do usuário</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da empresa"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
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
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crm">CRM/UF</Label>
                <Input
                  id="crm"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  placeholder="12345/SP"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Ex.: Cardiologia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
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
            </div>

            <div className="space-y-4">
              <Label>Partners Associados *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {partners.map(partner => (
                  <div key={partner.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`partner-${partner.id}`}
                      checked={selectedPartnerIds.includes(partner.id)}
                      onCheckedChange={(checked) => handlePartnerToggle(partner.id, checked as boolean)}
                    />
                    <Label htmlFor={`partner-${partner.id}`} className="text-sm">
                      {partner.name} - {partner.city}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedPartnerIds.length === 0 && (
                <p className="text-sm text-red-600">Selecione pelo menos um partner</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/affiliates")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-gradient-primary">
                {saving ? (
                  <>
                    <Building className="w-4 h-4 mr-2 animate-spin" />
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
