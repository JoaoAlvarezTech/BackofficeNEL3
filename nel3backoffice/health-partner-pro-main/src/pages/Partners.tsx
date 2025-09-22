import { useMemo, useState } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockdb, Partner } from "@/lib/mockdb";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const formatCurrency = (n?: number) =>
  typeof n === 'number' ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-success/10 text-success border-success/20">Ativo</Badge>;
    case 'inactive':
      return <Badge variant="secondary">Inativo</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getKycStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Aprovado
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-warning/10 text-warning border-warning/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      );
    case 'under_review':
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20">
          <Eye className="w-3 h-3 mr-1" />
          Em Análise
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Rejeitado
        </Badge>
      );
    default:
      return <Badge variant="outline">-</Badge>;
  }
};

export default function Partners() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const partners = mockdb.listPartners() || [];
  console.log('Partners - all partners:', partners);
  console.log('Partners - approved partners:', partners.filter(p => p.kycStatus === 'approved'));
  
  const filteredPartners = useMemo(() => {
    try {
      return partners.filter((partner: Partner) => {
        const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             partner.cnpj.includes(searchTerm) ||
                             (partner.city || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || partner.status === statusFilter;
        const matchesKyc = kycFilter === "all" ? partner.kycStatus === "approved" : partner.kycStatus === kycFilter;
        return matchesSearch && matchesStatus && matchesKyc;
      });
    } catch (error) {
      console.error('Error filtering partners:', error);
      return [];
    }
  }, [partners, searchTerm, statusFilter, kycFilter, refreshKey]);

  const handleEditPartner = (partner: Partner) => {
    toast.info("Editando partner", {
      description: `Editando informações de ${partner.name}`
    });
    navigate(`/partners/edit/${partner.id}`);
  };

  const handleDeletePartner = (partner: Partner) => {
    if (window.confirm(`Tem certeza que deseja remover o partner "${partner.name}"? Esta ação não pode ser desfeita.`)) {
      try {
        console.log('Deleting partner:', partner.id, partner.name);
        const deleted = mockdb.deletePartner(partner.id);
        console.log('Delete result:', deleted);
        
        if (deleted) {
          toast.success(`Partner "${partner.name}" removido com sucesso`, {
            description: "O partner foi removido permanentemente do sistema"
          });
          
          // Create notification (optional)
          try {
            mockdb.createNotification({
              type: 'kyc',
              title: 'Partner Removido',
              message: `${partner.name} - Partner removido do sistema`,
              priority: 'high',
              partnerId: partner.id,
              actionUrl: '/partners'
            });
            console.log('Notification created successfully');
          } catch (notifError) {
            console.error('Error creating notification:', notifError);
            // Continue even if notification fails
          }
          
          // Force list refresh
          setRefreshKey(prev => prev + 1);
        } else {
          console.error('Failed to delete partner - not found');
          toast.error("Erro ao remover partner", {
            description: "Partner não encontrado"
          });
        }
      } catch (error) {
        console.error('Error deleting partner:', error);
        toast.error("Erro ao remover partner", {
          description: "Tente novamente em alguns instantes"
        });
      }
    }
  };

  const handleViewApprovals = () => {
    const pendingCount = partners.filter(p => p.kycStatus === 'pending' || p.kycStatus === 'under_review').length;
    if (pendingCount > 0) {
      toast.info(`${pendingCount} partner(s) aguardando aprovação`, {
        description: "Redirecionando para a página de aprovações..."
      });
    } else {
      toast.info("Nenhum partner aguardando aprovação", {
        description: "Todos os partners já foram processados"
      });
    }
    navigate("/partners/approvals");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners Aprovados</h1>
          <p className="text-muted-foreground">
            Hospitais e clínicas com KYC aprovado
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleViewApprovals}>
            <Clock className="w-4 h-4 mr-2" />
            Ver Aprovações
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90" onClick={() => navigate('/partners/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Partner
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CNPJ ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="KYC Status" />
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

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Lista de Partners ({filteredPartners.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Volume Mensal</TableHead>
                  <TableHead>Contratos</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner: Partner) => (
                  <TableRow key={partner.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">{partner.name}</div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{partner.cnpj}</code>
                    </TableCell>
                    <TableCell>{getStatusBadge(partner.status)}</TableCell>
                    <TableCell>{getKycStatusBadge(partner.kycStatus)}</TableCell>
                    <TableCell>{partner.city}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(partner.volumeMonthly)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{partner.contracts ?? 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{partner.affiliatesCount ?? 0}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">-</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/partners/${partner.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPartner(partner)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/partners/${partner.id}/documents`)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Documentos
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeletePartner(partner)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPartners.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="space-y-2">
                        <Building2 className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Nenhum partner aprovado encontrado</p>
                        <p className="text-sm text-muted-foreground">
                          Cadastre novos partners ou verifique as aprovações pendentes
                        </p>
                        <div className="flex justify-center space-x-2 mt-4">
                          <Button size="sm" variant="outline" onClick={handleViewApprovals}>
                            <Clock className="w-4 h-4 mr-2" />
                            Ver Aprovações
                          </Button>
                          <Button size="sm" onClick={() => navigate("/partners/new")}>
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