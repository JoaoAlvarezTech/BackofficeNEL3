import { Building2, Users, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHospital from "./DashboardHospital";

const alerts = [
  {
    id: 1,
    type: 'kyc',
    title: 'KYC Pendentes',
    count: 3,
    description: '3 partners aguardando aprovação de documentos',
    priority: 'high'
  },
  {
    id: 2,
    type: 'operation',
    title: 'Operações Excepcionais',
    count: 2,
    description: 'Antecipações acima de R$ 500k precisam aprovação',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'settlement',
    title: 'Liquidações Pendentes',
    count: 8,
    description: 'R$ 2.1M em liquidações aguardando processamento',
    priority: 'low'
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === "hospital") {
    return <DashboardHospital />;
  }
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {user?.role === "hospital" ? "Visão do hospital: resumo de usuários e status" : "Visão geral das operações financeiras e performance dos partners"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Última atualização</p>
          <p className="text-sm font-medium">
            {new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Partners"
          value="47"
          change={{ value: "+12%", type: "increase" }}
          icon={<Building2 className="h-6 w-6" />}
          variant="primary"
        />
        <KPICard
          title="Usuários Ativos"
          value="283"
          change={{ value: "+8%", type: "increase" }}
          icon={<Users className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Volume Antecipações"
          value="R$ 4.1M"
          change={{ value: "+23%", type: "increase" }}
          icon={<TrendingUp className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Recebíveis Pendentes"
          value="R$ 12.8M"
          change={{ value: "-5%", type: "decrease" }}
          icon={<DollarSign className="h-6 w-6" />}
          variant="danger"
        />
      </div>

      {/* Alerts Section */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Alertas e Ações Pendentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{alert.title}</h4>
                  <Badge 
                    variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}
                  >
                    {alert.count}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <Progress 
                  value={alert.priority === 'high' ? 85 : alert.priority === 'medium' ? 60 : 30} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <PerformanceChart />

      {/* Recent Activities */}
      <RecentActivities />
    </div>
  );
}