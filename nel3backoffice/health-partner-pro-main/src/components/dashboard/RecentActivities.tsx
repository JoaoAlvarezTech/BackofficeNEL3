import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Clock
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: 'partner_approval',
    title: 'Hospital São Lucas aprovado',
    description: 'KYC concluído com sucesso',
    partner: 'Hospital São Lucas',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'success',
    icon: CheckCircle2
  },
  {
    id: 2,
    type: 'advance_request',
    title: 'Antecipação solicitada',
    description: 'R$ 250.000 em recebíveis de 30 dias',
    partner: 'Clínica Nova Era',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'pending',
    icon: TrendingUp
  },
  {
    id: 3,
    type: 'kyc_pending',
    title: 'KYC pendente',
    description: 'Documentos aguardando validação',
    partner: 'Med Center Plus',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'warning',
    icon: AlertTriangle
  },
  {
    id: 4,
    type: 'affiliate_new',
    title: 'Novo afiliado cadastrado',
    description: 'Dr. João Silva associado ao Hospital São Lucas',
    partner: 'Hospital São Lucas',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    status: 'info',
    icon: Users
  },
  {
    id: 5,
    type: 'partner_new',
    title: 'Novo partner cadastrado',
    description: 'Documentação inicial enviada',
    partner: 'Clínica Saúde Total',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: 'info',
    icon: Building2
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-success/10 text-success border-success/20';
    case 'warning': return 'bg-warning/10 text-warning border-warning/20';
    case 'pending': return 'bg-primary/10 text-primary border-primary/20';
    case 'info': return 'bg-muted text-muted-foreground border-border';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'success': return 'Concluído';
    case 'warning': return 'Atenção';
    case 'pending': return 'Pendente';
    case 'info': return 'Info';
    default: return 'Info';
  }
};

export function RecentActivities() {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Atividades Recentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <Badge variant="outline" className={getStatusColor(activity.status)}>
                      {getStatusText(activity.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{activity.partner}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(activity.timestamp, { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}