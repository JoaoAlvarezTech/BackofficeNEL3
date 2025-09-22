import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockdb, KycStatus } from "@/lib/mockdb";

export default function PartnersKyc() {
  const [status, setStatus] = useState<KycStatus | "all">("pending");
  const [q, setQ] = useState("");

  const partners = mockdb.listPartners() || [];
  const filtered = useMemo(() => partners.filter(p => {
    const st = status === "all" ? true : p.kycStatus === status;
    const query = q.trim().toLowerCase();
    const match = !query || p.name.toLowerCase().includes(query) || p.cnpj.includes(query);
    return st && match;
  }), [partners, status, q]);

  const setKyc = (id: string, s: KycStatus) => {
    mockdb.setPartnerKyc(id, s);
    
    // Create notification for status change
    const partner = partners.find(p => p.id === id);
    if (partner) {
      mockdb.createNotification({
        type: 'kyc',
        title: `KYC ${s === 'approved' ? 'Aprovado' : s === 'rejected' ? 'Rejeitado' : 'Atualizado'}`,
        message: `${partner.name} - Status KYC alterado para ${s}`,
        priority: s === 'rejected' ? 'high' : 'medium',
        partnerId: id,
        actionUrl: '/partners/kyc'
      });
    }
    
    // Force refresh via state update
    setStatus(s => s);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KYC Partners</h1>
          <p className="text-muted-foreground">Aprovação/gestão KYC (mock)</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Buscar por nome ou CNPJ" value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Status KYC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="under_review">Em Análise</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Fila de KYC</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Status KYC</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell><code className="text-sm">{p.cnpj}</code></TableCell>
                    <TableCell>{p.kycStatus}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => setKyc(p.id, "under_review")}>Analisar</Button>
                      <Button size="sm" className="bg-success/80" onClick={() => setKyc(p.id, "approved")}>Aprovar</Button>
                      <Button size="sm" variant="destructive" onClick={() => setKyc(p.id, "rejected")}>Rejeitar</Button>
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


