import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { Badge } from "@/components/ui/badge";
import { mockdb, AdvanceRequest, Charge } from "@/lib/mockdb";
import { 
  Users, 
  Percent, 
  Wallet, 
  TrendingUp, 
  CalendarDays, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Star
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

// Cores profissionais e corporativas
const COLORS = {
  primary: "#4f46e5",      // Indigo profissional
  success: "#059669",      // Verde corporativo
  warning: "#d97706",      // Âmbar profissional
  danger: "#dc2626",       // Vermelho corporativo
  info: "#0891b2",         // Ciano profissional
  purple: "#7c3aed",       // Roxo corporativo
  pink: "#be185d",         // Rosa profissional
  orange: "#ea580c",       // Laranja corporativo
  gradient: {
    primary: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
    success: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    warning: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    danger: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
  }
};

function formatCurrencyBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function DashboardHospital() {
  const periodDays = 30;

  const {
    activeUsers,
    totalAnticipatedVolume,
    pendingInvoicesCount,
    rebatePct,
    rebateValue,
    dailyAdvanceSeries,
    chargesSplit,
  } = useMemo(() => {
    const affiliates = mockdb.listAffiliates();
    const activeUsersCount = affiliates.filter(a => a.status === "active" && a.kycStatus === "approved").length;

    // Simular volume antecipado de R$ 500.000 no mês
    const simulatedAnticipatedVolume = 500000;
    
    // Buscar notas fiscais pendentes de aprovação
    const pendingInvoices = mockdb.listInvoices("pending");
    const pendingInvoicesCount = pendingInvoices.length;

    // Calcular rebate de 1% sobre o volume antecipado
    const rebatePercent = 1; // 1%
    const rebate = simulatedAnticipatedVolume * (rebatePercent / 100);

    // Simular série diária de antecipações (distribuindo os R$ 500k ao longo de 30 dias)
    const days = lastNDays(periodDays);
    const dailyAverage = simulatedAnticipatedVolume / periodDays;
    const dailySeries = days.map(d => {
      // Adicionar variação realística (±30%)
      const variation = (Math.random() - 0.5) * 0.6; // -30% a +30%
      const dailyAmount = dailyAverage * (1 + variation);
      return { 
        date: d.slice(5), 
        amount: Math.max(0, Math.round(dailyAmount)) 
      };
    });

    // Simular dados de aprovação de notas fiscais
    const totalInvoices = 150; // Total de notas processadas no mês
    const approvedInvoices = Math.round(totalInvoices * 0.85); // 85% aprovadas
    const rejectedInvoices = totalInvoices - approvedInvoices; // 15% rejeitadas
    
    const split = [
      { name: "Aprovadas", value: approvedInvoices },
      { name: "Rejeitadas", value: rejectedInvoices },
    ];

    return {
      activeUsers: activeUsersCount,
      totalAnticipatedVolume: simulatedAnticipatedVolume,
      pendingInvoicesCount: pendingInvoicesCount,
      rebatePct: rebatePercent,
      rebateValue: rebate,
      dailyAdvanceSeries: dailySeries,
      chargesSplit: split,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header profissional */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <Star className="h-7 w-7 text-blue-400" />
                  Dashboard Hospital
                </h1>
                <p className="text-slate-300 text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> 
                  Período: últimos 30 dias
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{formatCurrencyBRL(totalAnticipatedVolume)}</div>
                <div className="text-slate-300 text-sm">Volume Antecipado</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards profissionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700"></div>
            <CardContent className="relative p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Usuários Ativos</p>
                  <p className="text-2xl font-bold mt-1">{activeUsers}</p>
                  <div className="flex items-center gap-1 mt-1 text-green-100">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-xs">+12% vs mês anterior</span>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700"></div>
            <CardContent className="relative p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Rebate ({rebatePct}%)</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrencyBRL(rebateValue)}</p>
                  <div className="flex items-center gap-1 mt-1 text-blue-100">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-xs">+1% garantido</span>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Percent className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700"></div>
            <CardContent className="relative p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Notas Pendentes</p>
                  <p className="text-2xl font-bold mt-1">{pendingInvoicesCount}</p>
                  <div className="flex items-center gap-1 mt-1 text-amber-100">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-xs">Aguardando aprovação</span>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700"></div>
            <CardContent className="relative p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Carteira Antecipada</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrencyBRL(totalAnticipatedVolume)}</p>
                  <div className="flex items-center gap-1 mt-1 text-purple-100">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-xs">Volume do mês</span>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts profissionais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="col-span-2 border border-gray-200 shadow-md bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                Antecipações por Dia (30d)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyAdvanceSeries} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="colorAdvance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)} 
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(v: any) => [formatCurrencyBRL(Number(v)), 'Valor']}
                    labelStyle={{ color: '#1e293b' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    fill="url(#colorAdvance)"
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: '#4f46e5', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-md bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Recebíveis por Status
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chargesSplit} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)} 
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(v: any) => [formatCurrencyBRL(Number(v)), 'Valor']}
                    labelStyle={{ color: '#1e293b' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Aprovação de Notas */}
        <Card className="border border-gray-200 shadow-md bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-purple-600" />
              Aprovação de Notas Fiscais (30d)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chargesSplit} 
                      dataKey="value" 
                      nameKey="name" 
                      innerRadius={50} 
                      outerRadius={90} 
                      paddingAngle={4}
                      stroke="white"
                      strokeWidth={1}
                    >
                      {chargesSplit.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === "Aprovadas" ? "#059669" : "#dc2626"} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(v: any) => [`${v} notas`, 'Quantidade']}
                      labelStyle={{ color: '#1e293b' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex flex-col justify-center">
                {chargesSplit.map((s, i) => {
                  const percentage = ((s.value / chargesSplit.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
                  const color = s.name === "Aprovadas" ? "#059669" : "#dc2626";
                  return (
                    <div key={s.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <span className="font-medium text-gray-800 text-sm">{s.name}</span>
                          <div className="text-xs text-gray-500">{percentage}% do total</div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="bg-white border font-medium text-gray-700 text-xs"
                      >
                        {s.value} notas
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo de Performance - Foco no Lucro */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">💰 Lucro com Rebate</h3>
              <p className="text-emerald-200">Seu hospital ganha 1% de rebate sobre todo volume antecipado</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-yellow-300">{formatCurrencyBRL(rebateValue)}</div>
                <div className="text-emerald-200 font-semibold">Lucro Mensal</div>
                <div className="text-sm text-emerald-300 mt-1">Com rebate de {rebatePct}%</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{formatCurrencyBRL(rebateValue * 12)}</div>
                <div className="text-emerald-200 font-semibold">Lucro Anual</div>
                <div className="text-sm text-emerald-300 mt-1">Projeção anual</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">98.5%</div>
                <div className="text-emerald-200 font-semibold">Taxa de Aprovação</div>
                <div className="text-sm text-emerald-300 mt-1">Últimos 30 dias</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">2.3h</div>
                <div className="text-emerald-200 font-semibold">Tempo Médio</div>
                <div className="text-sm text-emerald-300 mt-1">Processamento</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/10 rounded-xl text-center">
              <p className="text-emerald-100">
                <strong>💡 Dica:</strong> Com R$ {formatCurrencyBRL(totalAnticipatedVolume)} antecipados este mês, 
                seu hospital ganhou <strong>{formatCurrencyBRL(rebateValue)}</strong> em rebate!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


