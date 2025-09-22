import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, MapPin, Building, Users, Plus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { mockdb, Partner, KycStatus } from "@/lib/mockdb";

export default function PartnersApprovals() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Get real data from mockdb
  let partners: Partner[] = [];
  
  try {
    partners = mockdb.listPartners() || [];
    console.log('PartnersApprovals - partners:', partners);
    console.log('PartnersApprovals - pending partners:', partners.filter(p => p.kycStatus === 'pending' || p.kycStatus === 'under_review'));
  } catch (error) {
    console.error('Error loading data:', error);
    toast.error("Erro ao carregar dados");
  }

  const rows = useMemo(() => {
    try {
      return partners.filter(p => {
        const query = q.trim().toLowerCase();
        return (p.kycStatus === "pending" || p.kycStatus === "under_review") && 
               (!query || p.name.toLowerCase().includes(query) || p.cnpj.includes(q) || (p.city || '').toLowerCase().includes(query));
      });
    } catch (error) {
      console.error('Error filtering rows:', error);
      return [];
    }
  }, [partners, q, refreshKey]);

  const setKyc = (id: string, status: KycStatus) => {
    console.log('setKyc called with:', id, status);
    
    const partner = partners.find(p => p.id === id);
    if (!partner) {
      console.error('Partner not found:', id);
      toast.error("Partner não encontrado");
      return;
    }

    console.log('Found partner:', partner);

    try {
      if (status === 'approved') {
        console.log('Approving partner:', id, partner.name);
        mockdb.setPartnerKyc(id, 'approved');
        console.log('Partner approved successfully');
        
        toast.success(`Partner "${partner.name}" aprovado!`, {
          description: "Partner aprovado com sucesso"
        });
        
        // Create notification (optional)
        try {
          mockdb.createNotification({
            type: 'kyc',
            title: 'KYC Aprovado',
            message: `${partner.name} - Status KYC alterado para aprovado`,
            priority: 'medium',
            partnerId: id,
            actionUrl: '/partners'
          });
          console.log('Notification created successfully');
        } catch (notifError) {
          console.error('Error creating notification:', notifError);
          // Continue even if notification fails
        }
        
        // Force list refresh immediately
        setRefreshKey(prev => prev + 1);
        
      } else if (status === 'rejected') {
        // Delete partner from system instead of just rejecting
        console.log('Rejecting and deleting partner:', id, partner.name);
        const deleted = mockdb.deletePartner(id);
        console.log('Delete result:', deleted);
        
        if (deleted) {
          toast.error(`Partner "${partner.name}" rejeitado e removido do sistema`, {
            description: "O partner foi rejeitado e removido permanentemente"
          });
          
          // Create notification (optional)
          try {
            mockdb.createNotification({
              type: 'kyc',
              title: 'KYC Rejeitado',
              message: `${partner.name} - Partner rejeitado e removido do sistema`,
              priority: 'high',
              actionUrl: '/partners/approvals'
            });
            console.log('Notification created successfully');
          } catch (notifError) {
            console.error('Error creating notification:', notifError);
            // Continue even if notification fails
          }
          
          // Force list refresh - deleted partner will disappear from the list
          setRefreshKey(prev => prev + 1);
        } else {
          console.error('Failed to delete partner - not found');
          toast.error("Erro ao remover partner do sistema", {
            description: "Partner não encontrado"
          });
        }
      }
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error("Erro ao atualizar status do partner", {
        description: "Tente novamente em alguns instantes"
      });
    }
  };

  const getKycBadge = (status: KycStatus) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-500 hover:bg-green-600">Aprovado</Badge>;
      case "pending": return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>;
      case "under_review": return <Badge className="bg-blue-500 hover:bg-blue-600">Em Análise</Badge>;
      case "rejected": return <Badge variant="destructive">Rejeitado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
      : <Badge variant="secondary">Inativo</Badge>;
  };

  const handleViewApproved = () => {
    const approvedCount = partners.filter(p => p.kycStatus === 'approved').length;
    if (approvedCount > 0) {
      toast.info(`${approvedCount} partner(s) aprovado(s)`, {
        description: "Redirecionando para a lista de aprovados..."
      });
    } else {
      toast.info("Nenhum partner aprovado ainda", {
        description: "Aprove alguns partners para vê-los na lista"
      });
    }
    navigate("/partners");
  };

  const handleNewPartner = () => {
    toast.info("Criando novo partner", {
      description: "Preencha o formulário para cadastrar um novo hospital/clínica"
    });
    navigate("/partners/new");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aprovações de Partners</h1>
          <p className="text-muted-foreground">Hospitais e clínicas aguardando aprovação KYC</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleViewApproved}>
            <Building className="w-4 h-4 mr-2" />
            Ver Aprovados
          </Button>
          <Button className="bg-gradient-primary" onClick={handleNewPartner}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Partner
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input 
              className="flex-1" 
              placeholder="Buscar por nome, CNPJ ou cidade" 
              value={q} 
              onChange={e => setQ(e.target.value)} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Pendentes</p>
                <p className="text-2xl font-bold">{partners.filter(p => p.kycStatus === 'pending' || p.kycStatus === 'under_review').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>
              <div>
                <p className="text-sm font-medium">Aguardando Análise</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {partners.filter(p => p.kycStatus === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-500 hover:bg-blue-600">Em Análise</Badge>
              <div>
                <p className="text-sm font-medium">Em Revisão</p>
                <p className="text-2xl font-bold text-blue-600">
                  {partners.filter(p => p.kycStatus === 'under_review').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Partners */}
      <Card>
        <CardHeader><CardTitle>Partners Pendentes ({rows.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Volume Mensal</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(partner => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partner.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {partner.cnpj}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                        {partner.city || '-'}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(partner.status)}</TableCell>
                    <TableCell>{getKycBadge(partner.kycStatus)}</TableCell>
                    <TableCell className="font-medium">
                      {partner.volumeMonthly ? 
                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(partner.volumeMonthly) : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/partners/${partner.id}`)}
                          title="Visualizar detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => setKyc(partner.id, 'approved')}
                          title="Aprovar partner"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => setKyc(partner.id, 'rejected')}
                          title="Rejeitar partner"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="space-y-2">
                        <Building className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Nenhum partner aguardando aprovação</p>
                        <p className="text-sm text-muted-foreground">
                          Cadastre novos partners ou verifique se há aprovações pendentes
                        </p>
                        <div className="flex justify-center space-x-2 mt-4">
                          <Button size="sm" variant="outline" onClick={handleViewApproved}>
                            <Building className="w-4 h-4 mr-2" />
                            Ver Aprovados
                          </Button>
                          <Button size="sm" onClick={handleNewPartner}>
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Partner
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
