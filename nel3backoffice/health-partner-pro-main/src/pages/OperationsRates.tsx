import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockdb } from "@/lib/mockdb";
import { useAuth } from "@/contexts/AuthContext";

export default function OperationsRates() {
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
  const [rates, setRates] = useState(mockdb.listRates() || []);
  const [refresh, setRefresh] = useState(0);

  const [partnerId, setPartnerId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [baseRatePct, setBaseRatePct] = useState<string>("2.50");
  const [fixedFee, setFixedFee] = useState<string>("3.50");

  // Update rates when refresh changes
  useEffect(() => {
    setRates(mockdb.listRates());
  }, [refresh]);

  // Initialize form with first partner/service
  useEffect(() => {
    if (partners.length > 0 && !partnerId) {
      setPartnerId(partners[0].id);
    }
  }, [partners, partnerId]);

  useEffect(() => {
    if (services.length > 0 && !serviceId) {
      setServiceId(services[0].id);
    }
  }, [services, serviceId]);

  const rows = useMemo(() => rates.map(r => ({
    ...r,
    partnerName: partners.find(p => p.id === r.partnerId)?.name || '-',
    serviceName: services.find(s => s.id === r.serviceId)?.name || '-',
  })), [rates, partners, services, refresh]);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const pct = parseFloat(baseRatePct.replace(/,/g, '.')) || 0;
    const fee = parseFloat(fixedFee.replace(/,/g, '.')) || 0;
    if (!partnerId || !serviceId) return;
    
    const rateData = {
      partnerId,
      serviceId,
      baseRatePct: pct,
      fixedFee: fee,
      effectiveDate: new Date().toISOString(),
      isActive: true,
      updatedAt: new Date().toISOString(),
      updatedBy: user.name
    };
    
    mockdb.upsertRate(rateData);
    setRefresh(prev => prev + 1);
  };

  const toggleRateStatus = (id: string) => {
    const rate = rates.find(r => r.id === id);
    if (rate) {
      mockdb.upsertRate({
        ...rate,
        isActive: !rate.isActive,
        updatedAt: new Date().toISOString(),
        updatedBy: user.name
      });
      setRefresh(prev => prev + 1);
    }
  };

  const getStatusBadge = (rate: any) => {
    const now = new Date().toISOString();
    if (!rate.isActive) return { label: "Inativo", variant: "secondary" as const };
    if (rate.expirationDate && rate.expirationDate < now) return { label: "Expirado", variant: "destructive" as const };
    if (rate.effectiveDate > now) return { label: "Futuro", variant: "outline" as const };
    return { label: "Ativo", variant: "default" as const };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuração de Taxas</h1>
        <p className="text-muted-foreground">Gestão de taxas por partner e serviço</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Novo/Atualizar</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-5" onSubmit={onSave}>
            <Select value={partnerId} onValueChange={setPartnerId}>
              <SelectTrigger className="sm:col-span-2"><SelectValue placeholder="Partner" /></SelectTrigger>
              <SelectContent>
                {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger className="sm:col-span-2"><SelectValue placeholder="Serviço" /></SelectTrigger>
              <SelectContent>
                {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="% Base" value={baseRatePct} onChange={e => setBaseRatePct(e.target.value)} />
            <Input placeholder="Tarifa fixa" value={fixedFee} onChange={e => setFixedFee(e.target.value)} />
            <Button type="submit" className="bg-success text-success-foreground hover:bg-success/90">Salvar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Taxas Configuradas ({rows.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>% Base</TableHead>
                  <TableHead>Tarifa Fixa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma taxa configurada.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(r => {
                    const status = getStatusBadge(r);
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.partnerName}</TableCell>
                        <TableCell>{r.serviceName}</TableCell>
                        <TableCell>{r.baseRatePct.toFixed(2)}%</TableCell>
                        <TableCell>R$ {r.fixedFee.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>{new Date(r.updatedAt).toLocaleString('pt-BR')}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant={r.isActive ? "destructive" : "default"}
                            onClick={() => toggleRateStatus(r.id)}
                          >
                            {r.isActive ? 'Desativar' : 'Ativar'}
                          </Button>
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


