import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockdb } from "@/lib/mockdb";
import { useAuth } from "@/contexts/AuthContext";

export default function OperationsCollections() {
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
  const services = mockdb.listServices() || [];
  const [q, setQ] = useState("");
  const [partnerId, setPartnerId] = useState<string | "all">("all");
  const [serviceId, setServiceId] = useState<string | "all">("all");
  const [refresh, setRefresh] = useState(0);

  const charges = mockdb.listCharges() || [];
  
  const rows = useMemo(() => charges.filter(c => {
    const partnerOk = partnerId === "all" || c.partnerId === partnerId;
    const serviceOk = serviceId === "all" || c.serviceId === serviceId;
    const term = q.trim();
    const qOk = !term || c.referenceId?.includes(term);
    return partnerOk && serviceOk && qOk;
  }), [charges, partnerId, serviceId, q, refresh]);

  const [newAmount, setNewAmount] = useState<string>("");
  const [newRef, setNewRef] = useState<string>("");
  const [newPartner, setNewPartner] = useState<string>("");
  const [newService, setNewService] = useState<string>("");

  // Update partner selection when partners load
  useEffect(() => {
    if (partners.length > 0 && !newPartner) {
      setNewPartner(partners[0].id);
    }
  }, [partners, newPartner]);

  // Update service selection when services load
  useEffect(() => {
    if (services.length > 0 && !newService) {
      setNewService("none");
    }
  }, [services, newService]);

  const addCharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount.replace(/,/g, '.')) || 0;
    if (!amount || !newPartner) {
      return;
    }
    const serviceId = newService === "none" ? undefined : newService;
    mockdb.upsertCharge({ amount, partnerId: newPartner, serviceId, status: "pending", referenceId: newRef || undefined });
    setNewAmount(""); 
    setNewRef("");
    setRefresh(prev => prev + 1);
  };

  const setStatus = (id: string, status: "pending" | "paid" | "contested" | "canceled") => {
    const item = charges.find(c => c.id === id);
    if (!item) return;
    mockdb.upsertCharge({ ...item, status });
    // Force re-render
    setRefresh(prev => prev + 1);
  };

  const currency = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cobranças</h1>
          <p className="text-muted-foreground">Submissão e gestão de cobranças (mock)</p>
        </div>
      </div>


      <Card>
        <CardContent className="p-6 grid gap-4 sm:grid-cols-4">
          <Input className="sm:col-span-2" placeholder="Buscar por referência" value={q} onChange={e => setQ(e.target.value)} />
          <Select value={partnerId} onValueChange={v => setPartnerId(v)}>
            <SelectTrigger><SelectValue placeholder="Partner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos parceiros</SelectItem>
              {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={serviceId} onValueChange={v => setServiceId(v)}>
            <SelectTrigger><SelectValue placeholder="Serviço" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos serviços</SelectItem>
              {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Nova Cobrança</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-5" onSubmit={addCharge}>
            <Select value={newPartner} onValueChange={setNewPartner}>
              <SelectTrigger className="sm:col-span-2"><SelectValue placeholder="Partner" /></SelectTrigger>
              <SelectContent>
                {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={newService} onValueChange={setNewService}>
              <SelectTrigger><SelectValue placeholder="Serviço" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-</SelectItem>
                {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Referência (opcional)" value={newRef} onChange={e => setNewRef(e.target.value)} />
            <Input placeholder="Valor" value={newAmount} onChange={e => setNewAmount(e.target.value)} />
            <Button type="submit" className="bg-gradient-primary">Incluir</Button>
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
                  <TableHead>Referência</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {charges.length === 0 ? 'Nenhuma cobrança encontrada. Adicione uma nova cobrança acima.' : 'Nenhuma cobrança corresponde aos filtros aplicados.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(c => (
                    <TableRow key={c.id}>
                      <TableCell>{c.referenceId || '-'}</TableCell>
                      <TableCell>{partners.find(p => p.id === c.partnerId)?.name || '-'}</TableCell>
                      <TableCell>{services.find(s => s.id === c.serviceId)?.name || '-'}</TableCell>
                      <TableCell>{currency(c.amount)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          c.status === 'paid' ? 'bg-success/10 text-success' :
                          c.status === 'pending' ? 'bg-warning/10 text-warning' :
                          c.status === 'contested' ? 'bg-destructive/10 text-destructive' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {c.status}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => setStatus(c.id, 'paid')}>Marcar pago</Button>
                        <Button size="sm" variant="secondary" onClick={() => setStatus(c.id, 'contested')}>Contestar</Button>
                        <Button size="sm" variant="destructive" onClick={() => setStatus(c.id, 'canceled')}>Cancelar</Button>
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


