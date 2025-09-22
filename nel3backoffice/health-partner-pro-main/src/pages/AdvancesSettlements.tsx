import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockdb } from "@/lib/mockdb";
import { useAuth } from "@/contexts/AuthContext";

export default function AdvancesSettlements() {
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
  const [refresh, setRefresh] = useState(0);
  const advances = mockdb.listAdvances() || [];

  // show approved to be settled
  const rows = useMemo(() => advances.filter(a => a.status === 'approved' || a.status === 'settled'), [advances, refresh]);

  const settle = (id: string) => {
    mockdb.setAdvanceStatus(id, 'settled');
    setRefresh(prev => prev + 1);
  };

  const toBRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Antecipações - Liquidações</h1>
        <p className="text-muted-foreground">Fluxo de liquidação de antecipações aprovadas (mock)</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Input placeholder="Buscar por parceiro" value={q} onChange={e => setQ(e.target.value)} />
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
                  <TableHead>Taxa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.filter(a => !q || partners.find(p => p.id === a.partnerId)?.name.toLowerCase().includes(q.toLowerCase())).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma antecipação aprovada para liquidação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.filter(a => !q || partners.find(p => p.id === a.partnerId)?.name.toLowerCase().includes(q.toLowerCase())).map(a => (
                    <TableRow key={a.id}>
                      <TableCell>{partners.find(p => p.id === a.partnerId)?.name || '-'}</TableCell>
                      <TableCell>{toBRL(a.amount)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          a.status === 'settled' ? 'bg-blue-100 text-blue-800' :
                          'bg-success/10 text-success'
                        }`}>
                          {a.status === 'approved' ? 'Aprovado' : 'Liquidado'}
                        </span>
                      </TableCell>
                      <TableCell>{a.appliedRatePct != null ? a.appliedRatePct.toFixed(2) + '%' : '-'}</TableCell>
                      <TableCell>
                        {a.status === 'approved' ? (
                          <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => settle(a.id)}>Liquidar</Button>
                        ) : null}
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


