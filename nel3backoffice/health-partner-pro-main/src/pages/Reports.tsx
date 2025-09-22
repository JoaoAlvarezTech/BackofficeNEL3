import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockdb } from "@/lib/mockdb";

export default function Reports() {
  const partners = mockdb.listPartners() || [];
  const charges = mockdb.listCharges() || [];
  const settlements = mockdb.listSettlements() || [];
  const advances = mockdb.listAdvances() || [];

  const totalCharges = charges.reduce((s, c) => s + c.amount, 0);
  const totalSettled = settlements.filter(s => s.status === 'executed').reduce((s, x) => s + x.amount, 0);
  const pendingAdv = advances.filter(a => a.status === 'requested').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">KPIs financeiros e volumes (mock)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Partners</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{partners.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Cobranças</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{totalCharges.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Liquidações Executadas</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{totalSettled.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Antecipações Pendentes</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{pendingAdv}</CardContent>
        </Card>
      </div>
    </div>
  );
}


