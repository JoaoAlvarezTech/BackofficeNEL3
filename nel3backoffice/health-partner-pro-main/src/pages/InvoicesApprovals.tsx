import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockdb, Invoice } from "@/lib/mockdb";
import { CheckCircle, XCircle, FileText, Search } from "lucide-react";

function formatCurrencyBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function InvoicesApprovals() {
  const [q, setQ] = useState("");
  const invoices = mockdb.listInvoices("pending");
  const affiliates = mockdb.listAffiliates();

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return invoices.filter(i => {
      const affiliateName = i.affiliateId ? (affiliates.find(a => a.id === i.affiliateId)?.name?.toLowerCase() || "") : "";
      return !query ||
        i.number.toLowerCase().includes(query) ||
        affiliateName.includes(query);
    });
  }, [q, invoices, affiliates]);

  const approve = (id: string) => {
    mockdb.setInvoiceStatus(id, "approved");
  };

  const reject = (id: string) => {
    mockdb.setInvoiceStatus(id, "rejected");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aprovação de Notas Fiscais</h1>
          <p className="text-muted-foreground">Revise e aprove ou rejeite as notas fiscais apresentadas pelos usuários</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número ou usuário"
                className="pl-10"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas Pendentes ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="w-[200px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((inv: Invoice) => {
                  const affiliateName = inv.affiliateId ? (affiliates.find(a => a.id === inv.affiliateId)?.name || "-") : "-";
                  return (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{inv.number}</span>
                        </div>
                      </TableCell>
                      <TableCell>{affiliateName}</TableCell>
                      <TableCell>{inv.issueDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{formatCurrencyBRL(inv.amount)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => approve(inv.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => reject(inv.id)}>
                            <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


