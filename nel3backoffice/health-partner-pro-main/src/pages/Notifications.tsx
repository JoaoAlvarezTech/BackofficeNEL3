import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockdb, Notification } from "@/lib/mockdb";
import { AlertTriangle, CheckCircle, Clock, DollarSign, Shield, Calendar } from "lucide-react";

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'kyc': return <Shield className="h-4 w-4" />;
    case 'advance': return <DollarSign className="h-4 w-4" />;
    case 'settlement': return <DollarSign className="h-4 w-4" />;
    case 'security': return <Shield className="h-4 w-4" />;
    case 'agenda': return <Calendar className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical': return <Badge variant="destructive">Crítico</Badge>;
    case 'high': return <Badge className="bg-orange-500">Alto</Badge>;
    case 'medium': return <Badge className="bg-yellow-500">Médio</Badge>;
    case 'low': return <Badge variant="secondary">Baixo</Badge>;
    default: return <Badge variant="outline">{priority}</Badge>;
  }
};

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("unread");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const notifications = mockdb.listNotifications() || [];
  const partners = mockdb.listPartners() || [];
  const affiliates = mockdb.listAffiliates() || [];

  const filtered = useMemo(() => notifications.filter(n => {
    const readFilter = filter === "all" || (filter === "read" ? n.read : !n.read);
    const typeOk = typeFilter === "all" || n.type === typeFilter;
    const priorityOk = priorityFilter === "all" || n.priority === priorityFilter;
    const searchOk = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    
    return readFilter && typeOk && priorityOk && searchOk;
  }), [notifications, filter, typeFilter, priorityFilter, search]);

  const markAsRead = (id: string) => {
    mockdb.markNotificationRead(id);
  };

  const markAllAsRead = () => {
    mockdb.markAllNotificationsRead();
  };

  const getEntityName = (notif: Notification) => {
    if (notif.partnerId) {
      const partner = partners.find(p => p.id === notif.partnerId);
      return partner?.name || 'Partner desconhecido';
    }
    if (notif.affiliateId) {
      const affiliate = affiliates.find(a => a.id === notif.affiliateId);
      return affiliate?.name || 'Usuário desconhecido';
    }
    return 'Sistema';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground">
            {unreadCount} não lidas de {notifications.length} total
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Input 
              placeholder="Buscar notificações..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="unread">Não lidas</SelectItem>
                <SelectItem value="read">Lidas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="kyc">KYC</SelectItem>
                <SelectItem value="advance">Antecipação</SelectItem>
                <SelectItem value="settlement">Liquidação</SelectItem>
                <SelectItem value="security">Segurança</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Notificações ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(notif => (
                  <TableRow key={notif.id} className={!notif.read ? "bg-muted/50" : ""}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(notif.type)}
                        <span className="capitalize">{notif.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(notif.priority)}
                        {getPriorityBadge(notif.priority)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{notif.title}</div>
                        <div className="text-sm text-muted-foreground">{notif.message}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getEntityName(notif)}</TableCell>
                    <TableCell>
                      {new Date(notif.createdAt).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {notif.read ? (
                        <Badge variant="secondary">Lida</Badge>
                      ) : (
                        <Badge className="bg-primary">Nova</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!notif.read && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => markAsRead(notif.id)}
                        >
                          Marcar como lida
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
