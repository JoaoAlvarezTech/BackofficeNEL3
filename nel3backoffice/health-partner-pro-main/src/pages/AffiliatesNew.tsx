import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockdb, PartnerStatus, KycStatus } from "@/lib/mockdb";
import { validateCNPJ, formatCNPJ } from "@/lib/validators";
import { toast } from "@/components/ui/sonner";

export default function AffiliatesNew() {
  const navigate = useNavigate();
  // Partners desnecessário na criação de usuário
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
  const [kycStatus, setKycStatus] = useState<KycStatus>("pending"); // Sempre pending para novos
  const [errors, setErrors] = useState<Record<string, string>>({});
  

  const handleCnpjChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setCnpj(formatted);
    
    if (errors.cnpj) {
      setErrors(prev => ({ ...prev, cnpj: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    // Validação de CNPJ desativada para usuários PF
    
    if (!city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }
    
    // Não exigir partners na criação de usuário
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }
    
    // Show loading state
    toast.info("Cadastrando usuário...", {
      description: "Aguarde um momento"
    });
    
    try {
      console.log('Creating affiliate with data:', {
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
        associatedPartnerIds: []
      });

      // Validate required fields
      if (!name.trim()) {
        throw new Error("Nome é obrigatório");
      }
      // Sem validação obrigatória de CNPJ
      if (!city.trim()) {
        throw new Error("Cidade é obrigatória");
      }
      // Sem vínculo obrigatório com partner na criação

      // Use createAffiliate instead of upsertAffiliate for new records
      const affiliate = mockdb.createAffiliate({
        name: name.trim(),
        cnpj,
        cpf,
        crm,
        specialty,
        email,
        phone,
        city: city.trim(),
        address: address.trim() || undefined,
        associatedPartnerIds: [],
        status,
        kycStatus
      });

      console.log('Affiliate created successfully:', affiliate);
      
      // Create notification for new user (optional)
      try {
        mockdb.createNotification({
          type: 'kyc',
          title: 'Novo Usuário Cadastrado',
          message: `${name} foi cadastrado e precisa de aprovação KYC`,
          priority: 'medium',
          affiliateId: affiliate.id,
          actionUrl: '/affiliates/approvals'
        });
        console.log('Notification created successfully');
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        // Continue even if notification fails
      }
      
      toast.success(`Usuário "${name}" cadastrado com sucesso!`, {
        description: "Redirecionando para a página de aprovações..."
      });
      
      // Small delay to show the toast
      setTimeout(() => {
        console.log('Redirecting to /affiliates/approvals');
        navigate("/affiliates/approvals");
      }, 1500);
      
    } catch (error) {
      console.error('Error creating affiliate:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error("Erro ao cadastrar afiliado", {
        description: errorMessage
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Usuário</h1>
        <p className="text-muted-foreground">Cadastro de usuário (profissional da saúde)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
          <CardTitle>Dados do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome completo *</Label>
                <Input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Nome completo"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input 
                  value={cpf} 
                  onChange={e => setCpf(e.target.value)} 
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cidade *</Label>
                <Input 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  placeholder="Cidade"
                  className={errors.city ? "border-destructive" : ""}
                />
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="Endereço completo (opcional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CRM/UF</Label>
                <Input 
                  value={crm} 
                  onChange={e => setCrm(e.target.value)} 
                  placeholder="12345/SP"
                />
              </div>
              <div className="space-y-2">
                <Label>Especialidade</Label>
                <Input 
                  value={specialty} 
                  onChange={e => setSpecialty(e.target.value)} 
                  placeholder="Ex.: Cardiologia"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partners */}
        {/* Sem seleção de partners na criação de usuário */}

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as PartnerStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> O usuário será cadastrado com status KYC "Pendente" e precisará ser aprovado na aba de Aprovações.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-gradient-primary">
            Cadastrar Usuário
          </Button>
        </div>
      </form>
    </div>
  );
}