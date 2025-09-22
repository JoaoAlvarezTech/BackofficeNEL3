import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockdb, ReconciliationItem } from "@/lib/mockdb";
import { useAuth } from "@/contexts/AuthContext";

export default function OperationsReconciliation() {
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

  const [fileText, setFileText] = useState<string>("");
  const [items, setItems] = useState(mockdb.listReconciliation() || []);
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);

  // Update items when refresh changes
  useEffect(() => {
    setItems(mockdb.listReconciliation());
  }, [refresh]);

  const rows = useMemo(() => items.filter(i => !q || i.referenceId.includes(q)), [items, q, refresh]);

  const parseAndImport = () => {
    const parsed: ReconciliationItem[] = fileText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [referenceId, amount] = line.split(',');
        return {
          id: Math.random().toString(36).slice(2),
          referenceId: referenceId.trim(),
          amountFile: parseFloat((amount || '0').replace(/,/g, '.')) || 0,
          amountSystem: undefined,
          matched: false,
          partnerId: undefined,
          transactionDate: new Date().toISOString(),
          bankCode: undefined,
          status: 'pending' as const
        } as ReconciliationItem;
      });
    mockdb.addReconciliationItems(parsed);
    setFileText("");
    setRefresh(prev => prev + 1);
  };

  const autoMatch = () => {
    mockdb.autoMatchReconciliation();
    setRefresh(prev => prev + 1);
  };

  const getStatusBadge = (item: ReconciliationItem) => {
    if (item.matched) return { label: 'Conferido', variant: 'default' as const };
    if (item.amountSystem && Math.abs(item.amountFile - item.amountSystem) > 0.01) return { label: 'Divergência', variant: 'destructive' as const };
    return { label: 'Pendente', variant: 'secondary' as const };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conciliação</h1>
        <p className="text-muted-foreground">Importe arquivo e compare com dados do sistema</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Importar</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <Input placeholder="Buscar por referência" value={q} onChange={e => setQ(e.target.value)} />
          <textarea className="min-h-[160px] rounded-md border p-3 bg-background" placeholder="REF001,100.50\nREF002,200.00" value={fileText} onChange={e => setFileText(e.target.value)} />
          <div>
            <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={parseAndImport}>Importar</Button>
            <Button variant="secondary" className="ml-2" onClick={autoMatch}>Auto-Match</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Conciliações ({rows.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referência</TableHead>
                  <TableHead>Valor Arquivo</TableHead>
                  <TableHead>Valor Sistema</TableHead>
                  <TableHead>Diferença</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma conciliação encontrada. Importe um arquivo para começar.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(i => {
                    const status = getStatusBadge(i);
                    const difference = i.amountSystem ? i.amountFile - i.amountSystem : 0;
                    return (
                      <TableRow key={i.id}>
                        <TableCell className="font-medium">{i.referenceId}</TableCell>
                        <TableCell>R$ {i.amountFile.toFixed(2)}</TableCell>
                        <TableCell>{i.amountSystem != null ? `R$ ${i.amountSystem.toFixed(2)}` : '-'}</TableCell>
                        <TableCell className={difference !== 0 ? 'text-destructive' : 'text-success'}>
                          {i.amountSystem ? `R$ ${difference.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
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


