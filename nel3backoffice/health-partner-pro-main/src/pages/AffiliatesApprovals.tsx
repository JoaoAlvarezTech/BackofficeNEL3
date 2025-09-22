import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, MapPin, Building, Users, Plus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { mockdb, Affiliate, KycStatus } from "@/lib/mockdb";

export default function AffiliatesApprovals() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Get real data from mockdb
  let affiliates: Affiliate[] = [];
  let partners: any[] = [];
  
  try {
    affiliates = mockdb.listAffiliates() || [];
    partners = mockdb.listPartners() || [];
    console.log('AffiliatesApprovals - affiliates:', affiliates);
    console.log('AffiliatesApprovals - partners:', partners);
  } catch (error) {
    console.error('Error loading data:', error);
    toast.error("Erro ao carregar dados");
  }

  const rows = useMemo(() => {
    try {
      return affiliates.filter(a => {
        const query = q.trim().toLowerCase();
        return (a.kycStatus === "pending" || a.kycStatus === "under_review") && 
               (!query || a.name.toLowerCase().includes(query) || a.cnpj.includes(q) || a.city.toLowerCase().includes(query));
      });
    } catch (error) {
      console.error('Error filtering rows:', error);
      return [];
    }
  }, [affiliates, q, refreshKey]);

  const partnerName = (id: string) => partners.find(p => p.id === id)?.name || "-";

  const setKyc = (id: string, status: KycStatus) => {
    const affiliate = affiliates.find(a => a.id === id);
    if (!affiliate) {
      toast.error("Usuário não encontrado");
      return;
    }

    try {
      if (status === 'approved') {
        console.log('Approving affiliate:', id, affiliate.name);
        mockdb.approveAffiliate(id);
        console.log('Affiliate approved successfully');
        
        toast.success(`Usuário "${affiliate.name}" aprovado!`, {
          description: "Redirecionando para a lista de aprovados..."
        });
        
        // Create notification (optional)
        try {
          mockdb.createNotification({
            type: 'kyc',
            title: 'KYC Aprovado',
            message: `${affiliate.name} - Status KYC alterado para aprovado`,
            priority: 'medium',
            affiliateId: id,
            actionUrl: '/affiliates'
          });
          console.log('Notification created successfully');
        } catch (notifError) {
          console.error('Error creating notification:', notifError);
          // Continue even if notification fails
        }
        
        // Force list refresh - approved affiliate will disappear from pending list
        setRefreshKey(prev => prev + 1);
      } else if (status === 'rejected') {
        // Delete affiliate from system instead of just rejecting
        console.log('Rejecting and deleting affiliate:', id, affiliate.name);
        const deleted = mockdb.deleteAffiliate(id);
        console.log('Delete result:', deleted);
        
        if (deleted) {
          toast.error(`Usuário "${affiliate.name}" rejeitado e removido do sistema`, {
            description: "O usuário foi rejeitado e removido permanentemente"
          });
          
          // Create notification (optional)
          try {
            mockdb.createNotification({
              type: 'kyc',
            title: 'KYC Rejeitado',
            message: `${affiliate.name} - Usuário rejeitado e removido do sistema`,
              priority: 'high',
              actionUrl: '/affiliates/approvals'
            });
            console.log('Notification created successfully');
          } catch (notifError) {
            console.error('Error creating notification:', notifError);
            // Continue even if notification fails
          }
          
          // Force list refresh - deleted affiliate will disappear from the list
          setRefreshKey(prev => prev + 1);
        } else {
          console.error('Failed to delete affiliate - not found');
          toast.error("Erro ao remover usuário do sistema", {
            description: "Usuário não encontrado"
          });
        }
      }
    } catch (error) {
      console.error('Error updating affiliate:', error);
      toast.error("Erro ao atualizar status do usuário", {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aprovações de Usuários</h1>
          <p className="text-muted-foreground">Análise e aprovação de usuários (pessoas jurídicas)</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/affiliates")}>
            <Users className="w-4 h-4 mr-2" />
            Ver Aprovados
          </Button>
          <Button onClick={() => navigate("/affiliates/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Input 
            placeholder="Buscar por nome, CNPJ ou cidade..." 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Aguardando Aprovação ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>CRM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(affiliate => (
                  <TableRow key={affiliate.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{affiliate.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{affiliate.cpf || '-'}</TableCell>
                    <TableCell>{affiliate.crm || '-'}</TableCell>
                    <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                    <TableCell>{getKycBadge(affiliate.kycStatus)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => setKyc(affiliate.id, "approved")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => setKyc(affiliate.id, "rejected")}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejeitar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="space-y-2">
                        <Clock className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Nenhum usuário aguardando aprovação</p>
                        <p className="text-sm text-muted-foreground">
                          Todos os usuários foram processados ou cadastre novos usuários
                        </p>
                        <div className="flex justify-center space-x-2 mt-4">
                          <Button size="sm" variant="outline" onClick={() => navigate("/affiliates")}>
                            <Users className="w-4 h-4 mr-2" />
                            Ver Aprovados
                          </Button>
                          <Button size="sm" onClick={() => navigate("/affiliates/new")}>
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Usuário
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

      {/* Documentos Necessários */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Necessários para Aprovação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Documentos Obrigatórios
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Contrato social atualizado</li>
                <li>• CNPJ válido e ativo</li>
                <li>• Comprovante de endereço</li>
                <li>• Cartão CNPJ da Receita Federal</li>
                <li>• Inscrição estadual (se aplicável)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Critérios de Aprovação
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• CNPJ ativo na Receita Federal</li>
                <li>• Documentação completa e válida</li>
                <li>• Endereço verificado</li>
                <li>• Sem restrições cadastrais</li>
                <li>• Contrato social regular</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}