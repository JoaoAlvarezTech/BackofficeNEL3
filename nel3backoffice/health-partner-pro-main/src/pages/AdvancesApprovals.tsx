import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockdb } from "@/lib/mockdb";
import { useAuth } from "@/contexts/AuthContext";

export default function AdvancesApprovals() {
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
  const [q, setQ] = useState("");
  const [partnerId, setPartnerId] = useState<string | "all">("all");
  const [refresh, setRefresh] = useState(0);
  const advances = mockdb.listAdvances() || [];

  // Show requested items to approve
  const rows = useMemo(() => advances.filter(a => {
    if (a.status !== 'requested') return false;
    const pOk = partnerId === "all" || a.partnerId === partnerId;
    const term = q.trim();
    const qOk = !term || partners.find(p => p.id === a.partnerId)?.name.toLowerCase().includes(term.toLowerCase());
    return pOk && qOk;
  }), [advances, partnerId, q, partners, refresh]);

  const setStatus = (id: string, status: "approved" | "rejected", rate?: number) => {
    const advance = advances.find(a => a.id === id);
    if (!advance) return;
    
    mockdb.setAdvanceStatus(id, status, rate);
    
    // Use limit if approved
    if (status === 'approved') {
      mockdb.useLimit(advance.partnerId, advance.amount, 'daily');
    }
    
    // Create notification
    const partner = partners.find(p => p.id === advance.partnerId);
    if (partner) {
      mockdb.createNotification({
        type: 'advance',
        title: `Antecipação ${status === 'approved' ? 'Aprovada' : 'Rejeitada'}`,
        message: `${partner.name} - Pedido de ${advance.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ${status === 'approved' ? 'aprovado' : 'rejeitado'}`,
        priority: status === 'rejected' ? 'high' : 'medium',
        partnerId: advance.partnerId,
        actionUrl: '/advances/settlements'
      });
    }
    
    setRefresh(prev => prev + 1);
  };

  const toBRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Antecipações - Aprovações</h1>
        <p className="text-muted-foreground">Aprove ou rejeite pedidos pendentes (mock)</p>
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
        <CardHeader><CardTitle>Pendentes</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Nenhum pedido pendente de aprovação encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>{partners.find(p => p.id === a.partnerId)?.name || '-'}</TableCell>
                      <TableCell>{toBRL(a.amount)}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => setStatus(a.id, 'approved', 2.9)}>Aprovar</Button>
                        <Button size="sm" variant="destructive" onClick={() => setStatus(a.id, 'rejected')}>Rejeitar</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


