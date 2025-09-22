import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockdb } from "@/lib/mockdb";
import { useAuth } from "@/contexts/AuthContext";

export default function AdvancesRequests() {
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
  const [newPartner, setNewPartner] = useState<string>("");
  const [newAmount, setNewAmount] = useState<string>("");
  const [refresh, setRefresh] = useState(0);
  const advances = mockdb.listAdvances() || [];
  
  // Update partner selection when partners load
  useEffect(() => {
    if (partners.length > 0 && !newPartner) {
      setNewPartner(partners[0].id);
    }
  }, [partners, newPartner]);

  const rows = useMemo(() => advances.filter(a => {
    const pOk = partnerId === "all" || a.partnerId === partnerId;
    const term = q.trim();
    const qOk = !term || partners.find(p => p.id === a.partnerId)?.name.toLowerCase().includes(term.toLowerCase());
    return pOk && qOk;
  }), [advances, partnerId, q, partners, refresh]);

  const setStatus = (id: string, status: "approved" | "rejected", rate?: number) => {
    mockdb.setAdvanceStatus(id, status, rate);
    setRefresh(prev => prev + 1);
  };

  const createAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount.replace(/,/g, '.')) || 0;
    if (!newPartner || !amt) return;
    
    // Check limits
    const canProceed = mockdb.checkLimit(newPartner, amt, 'daily');
    if (!canProceed) {
      alert('Limite diário excedido para este partner');
      return;
    }
    
    // Create advance
    const advance = mockdb.createAdvance({ partnerId: newPartner, amount: amt });
    
    // Create notification
    const partner = partners.find(p => p.id === newPartner);
    if (partner) {
      mockdb.createNotification({
        type: 'advance',
        title: 'Novo Pedido de Antecipação',
        message: `${partner.name} solicitou antecipação de ${amt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        priority: amt > 100000 ? 'high' : 'medium',
        partnerId: newPartner,
        actionUrl: '/advances/approvals'
      });
    }
    
    setNewAmount("");
    setRefresh(prev => prev + 1);
  };

  const toBRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Antecipações - Pedidos</h1>
        <p className="text-muted-foreground">Avaliar e aprovar pedidos (mock)</p>
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
        <CardHeader><CardTitle>Novo Pedido</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-4" onSubmit={createAdvance}>
            <Select value={newPartner} onValueChange={setNewPartner}>
              <SelectTrigger className="sm:col-span-2"><SelectValue placeholder="Partner" /></SelectTrigger>
              <SelectContent>
                {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Valor" value={newAmount} onChange={e => setNewAmount(e.target.value)} />
            <Button type="submit" className="bg-gradient-primary">Solicitar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lista</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Taxa Aplicada</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {advances.length === 0 ? 'Nenhuma antecipação encontrada. Crie um novo pedido acima.' : 'Nenhuma antecipação corresponde aos filtros aplicados.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>{partners.find(p => p.id === a.partnerId)?.name || '-'}</TableCell>
                      <TableCell>{toBRL(a.amount)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          a.status === 'approved' ? 'bg-success/10 text-success' :
                          a.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                          a.status === 'settled' ? 'bg-blue-100 text-blue-800' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {a.status === 'requested' ? 'Pendente' : 
                           a.status === 'approved' ? 'Aprovado' :
                           a.status === 'rejected' ? 'Rejeitado' :
                           a.status === 'settled' ? 'Liquidado' : a.status}
                        </span>
                      </TableCell>
                      <TableCell>{a.appliedRatePct != null ? a.appliedRatePct.toFixed(2) + '%' : '-'}</TableCell>
                      <TableCell className="space-x-2">
                        {a.status === 'requested' && (
                          <>
                            <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => setStatus(a.id, 'approved', 2.9)}>Aprovar</Button>
                            <Button size="sm" variant="destructive" onClick={() => setStatus(a.id, 'rejected')}>Rejeitar</Button>
                          </>
                        )}
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


