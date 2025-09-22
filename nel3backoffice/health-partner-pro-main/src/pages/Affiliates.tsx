import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockdb, Affiliate, KycStatus } from "@/lib/mockdb";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, Search, MapPin, Building, Clock, Edit, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function Affiliates() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [kyc, setKyc] = useState<"all" | "pending" | "under_review" | "approved" | "rejected">("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const affiliates = mockdb.listAffiliates() || [];
  const partners = mockdb.listPartners() || [];
  const { user } = useAuth();

  const rows = useMemo(() => affiliates.filter(a => {
    const query = q.trim().toLowerCase();
    const matchesQuery = !query || 
      a.name.toLowerCase().includes(query) || 
      a.cnpj.includes(q) ||
      a.city.toLowerCase().includes(query);
    const matchesKyc = kyc === "all" ? a.kycStatus === "approved" : a.kycStatus === kyc;
    return matchesQuery && matchesKyc;
  }), [affiliates, q, kyc, refreshKey]);

  const partnerName = (id: string) => partners.find(p => p.id === id)?.name || "-";

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

  const handleViewApprovals = () => {
    const pendingCount = affiliates.filter(a => a.kycStatus === 'pending' || a.kycStatus === 'under_review').length;
    if (pendingCount > 0) {
      toast.info(`${pendingCount} usuário(s) aguardando aprovação`, {
        description: "Redirecionando para a página de aprovações..."
      });
    } else {
      toast.info("Nenhum usuário aguardando aprovação", {
        description: "Todos os afiliados já foram processados"
      });
    }
    navigate("/affiliates/approvals");
  };

  const handleNewAffiliate = () => {
    toast.info("Criando novo usuário", {
      description: "Preencha o formulário para cadastrar um novo usuário"
    });
    navigate("/affiliates/new");
  };

  const handleEditAffiliate = (affiliate: Affiliate) => {
    toast.info("Editando usuário", {
      description: `Editando informações de ${affiliate.name}`
    });
    navigate(`/affiliates/edit/${affiliate.id}`);
  };

  const handleDeleteAffiliate = (affiliate: Affiliate) => {
    if (window.confirm(`Tem certeza que deseja remover o usuário "${affiliate.name}"? Esta ação não pode ser desfeita.`)) {
      try {
        console.log('Deleting affiliate:', affiliate.id, affiliate.name);
        const deleted = mockdb.deleteAffiliate(affiliate.id);
        console.log('Delete result:', deleted);
        
        if (deleted) {
          toast.success(`Usuário "${affiliate.name}" removido com sucesso`, {
            description: "O usuário foi removido permanentemente do sistema"
          });
          
          // Create notification (optional)
          try {
            mockdb.createNotification({
              type: 'kyc',
              title: 'Usuário Removido',
              message: `${affiliate.name} - Usuário removido do sistema`,
              priority: 'high',
              actionUrl: '/affiliates'
            });
            console.log('Notification created successfully');
          } catch (notifError) {
            console.error('Error creating notification:', notifError);
            // Continue even if notification fails
          }
          
          // Force list refresh
          setRefreshKey(prev => prev + 1);
        } else {
          console.error('Failed to delete affiliate - not found');
          toast.error("Erro ao remover usuário", {
            description: "Usuário não encontrado"
          });
        }
      } catch (error) {
        console.error('Error deleting affiliate:', error);
        toast.error("Erro ao remover usuário", {
          description: "Tente novamente em alguns instantes"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários Aprovados</h1>
          <p className="text-muted-foreground">Lista de usuários com KYC aprovado</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleViewApprovals}>
            <Clock className="w-4 h-4 mr-2" />
            Ver Aprovações
          </Button>
          <Button className="bg-gradient-primary" onClick={handleNewAffiliate}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
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
            <Select value={kyc} onValueChange={(v) => setKyc(v as any)}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Status KYC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos KYC</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="under_review">Em Análise</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
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
                <p className="text-sm font-medium">Total Aprovados</p>
                <p className="text-2xl font-bold">{affiliates.filter(a => a.kycStatus === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
              <div>
                <p className="text-sm font-medium">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {affiliates.filter(a => a.kycStatus === 'approved' && a.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>
              <div>
                <p className="text-sm font-medium">Aguardando Aprovação</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {affiliates.filter(a => a.kycStatus === 'pending' || a.kycStatus === 'under_review').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader><CardTitle>Usuários Aprovados ({rows.length})</CardTitle></CardHeader>
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
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/affiliates/${affiliate.id}`)}
                          title="Visualizar detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditAffiliate(affiliate)}
                          title="Editar usuário"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteAffiliate(affiliate)}
                          title="Remover usuário"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="space-y-2">
                        <Building className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Nenhum usuário aprovado encontrado</p>
                        <p className="text-sm text-muted-foreground">
                          Cadastre novos usuários ou verifique as aprovações pendentes
                        </p>
                        <div className="flex justify-center space-x-2 mt-4">
                          <Button size="sm" variant="outline" onClick={handleViewApprovals}>
                            <Clock className="w-4 h-4 mr-2" />
                            Ver Aprovações
                          </Button>
                          <Button size="sm" onClick={handleNewAffiliate}>
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
    </div>
  );
}