import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockdb, PartnerStatus, KycStatus } from "@/lib/mockdb";
import { validateCNPJ, formatCNPJ } from "@/lib/validators";

export default function PartnersNew() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<PartnerStatus>("active");
  const [kycStatus, setKycStatus] = useState<KycStatus>("pending");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCnpjChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setCnpj(formatted);
    
    // Clear error when user starts typing
    if (errors.cnpj) {
      setErrors(prev => ({ ...prev, cnpj: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (!validateCNPJ(cnpj)) {
      newErrors.cnpj = "CNPJ inválido";
    }
    
    if (!city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    console.log('Creating partner with data:', {
      name: name.trim(),
      cnpj,
      city: city.trim(),
      address: address.trim() || undefined,
      status,
      kycStatus
    });
    
    try {
      const partner = mockdb.upsertPartner({ 
        name: name.trim(), 
        cnpj, 
        city: city.trim(), 
        address: address.trim() || undefined,
        status, 
        kycStatus 
      });
      
      console.log('Partner created successfully:', partner);
      
      // Create notification for new partner
      try {
        mockdb.createNotification({
          type: 'kyc',
          title: 'Novo Partner Cadastrado',
          message: `${name} foi cadastrado e precisa de aprovação KYC`,
          priority: 'medium',
          partnerId: partner.id,
          actionUrl: '/partners/approvals'
        });
        console.log('Notification created successfully');
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        // Continue even if notification fails
      }
      
      console.log('Redirecting to /partners/approvals');
      navigate("/partners/approvals");
    } catch (error) {
      console.error('Error creating partner:', error);
      // Show error message to user
      alert('Erro ao criar partner. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Partner</h1>
        <p className="text-muted-foreground">Cadastro simplificado de pessoa jurídica (mock)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados do Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 max-w-xl" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label>Nome *</Label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Razão Social"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label>CNPJ *</Label>
              <Input 
                value={cnpj} 
                onChange={e => handleCnpjChange(e.target.value)} 
                placeholder="00.000.000/0000-00"
                className={errors.cnpj ? "border-destructive" : ""}
              />
              {errors.cnpj && <p className="text-sm text-destructive mt-1">{errors.cnpj}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Cidade *</Label>
              <Input 
                value={city} 
                onChange={e => setCity(e.target.value)} 
                placeholder="Cidade"
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Endereço</Label>
              <Input 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                placeholder="Endereço completo (opcional)"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <Label>KYC</Label>
                <Select value={kycStatus} onValueChange={(v) => setKycStatus(v as KycStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="KYC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="under_review">Em Análise</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit" className="bg-gradient-primary">Salvar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


