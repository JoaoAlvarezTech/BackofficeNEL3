import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockdb } from "@/lib/mockdb";
import { useAuth } from "@/contexts/AuthContext";

export default function OperationsSettlements() {
  const { user } = useAuth();
  
  // Check if user is authenticated and has correct role
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Não autenticado</h2>
          <p className="text-muted-foreground">Você precisa fazer login para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'nel3') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acesso negado</h2>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-muted-foreground mt-2">Role atual: {user.role}</p>
        </div>
      </div>
    );
  }

  const partners = mockdb.listPartners() || [];
  const [partnerId, setPartnerId] = useState<string | "all">("all");
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [settlements, setSettlements] = useState(mockdb.listSettlements() || []);

  // Update settlements when refresh changes
  useEffect(() => {
    setSettlements(mockdb.listSettlements());
  }, [refresh]);

  const rows = useMemo(() => settlements.filter(s => {
    const pOk = partnerId === "all" || s.partnerId === partnerId;
    const search = q.trim();
    const qOk = !search || partners.find(p => p.id === s.partnerId)?.name.toLowerCase().includes(search.toLowerCase());
    return pOk && qOk;
  }), [settlements, partnerId, q, partners, refresh]);

  const setStatus = (id: string, status: "scheduled" | "executed") => {
    mockdb.setSettlementStatus(id, status);
    setRefresh(prev => prev + 1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return { label: 'Agendado', variant: 'secondary' as const };
      case 'executed': return { label: 'Executado', variant: 'default' as const };
      default: return { label: status, variant: 'secondary' as const };
    }
  };

  const currency = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Execução de Liquidações</h1>
        <p className="text-muted-foreground">Gestão e execução de liquidações</p>
      </div>

      <Card>
        <CardContent className="p-6 grid gap-4 sm:grid-cols-3">
          <Input placeholder="Buscar por parceiro" value={q} onChange={e => setQ(e.target.value)} />
          <Select value={partnerId} onValueChange={v => setPartnerId(v)}>
            <SelectTrigger><SelectValue placeholder="Partner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Liquidações ({rows.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma liquidação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(s => {
                    const status = getStatusBadge(s.status);
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{partners.find(p => p.id === s.partnerId)?.name || '-'}</TableCell>
                        <TableCell className="font-medium">{currency(s.amount)}</TableCell>
                        <TableCell>{new Date(s.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          {s.status === 'scheduled' && (
                            <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => setStatus(s.id, 'executed')}>
                              Executar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


