import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockdb } from "@/lib/mockdb";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Agendas() {
  const partners = mockdb.listPartners() || [];
  const [partnerId, setPartnerId] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [capacity, setCapacity] = useState<string>("");
  const [booked, setBooked] = useState<string>("");

  const agenda = mockdb.listAgenda(partnerId === 'all' ? undefined : partnerId);
  const byDate = useMemo(() => {
    const map = new Map<string, { capacity: number; booked: number }>();
    agenda.forEach(s => map.set(s.date, { capacity: s.capacity, booked: s.booked }));
    return map;
  }, [agenda]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendas</h1>
        <p className="text-muted-foreground">Visão geral e por parceiro (mock)</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtro</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Select value={partnerId} onValueChange={v => setPartnerId(v)}>
            <SelectTrigger><SelectValue placeholder="Partner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos parceiros</SelectItem>
              {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Calendário</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            <Calendar mode="single" selected={selected} onSelect={setSelected} />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Dia selecionado</h3>
              <p className="text-sm text-muted-foreground">{selected?.toLocaleDateString('pt-BR')}</p>
              <div className="mt-4">
                {selected ? (
                  (() => {
                    const key = selected.toISOString().slice(0,10);
                    const info = byDate.get(key);
                    if (!info) return <p className="text-sm">Sem capacidade informada.</p>;
                    const avail = Math.max(info.capacity - info.booked, 0);
                    return (
                      <div className="text-sm">
                        <p>Capacidade: {info.capacity}</p>
                        <p>Reservado: {info.booked}</p>
                        <p>Disponível: {avail}</p>
                      </div>
                    );
                  })()
                ) : null}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <Input placeholder="Capacidade" value={capacity} onChange={e => setCapacity(e.target.value)} />
                <Input placeholder="Reservado" value={booked} onChange={e => setBooked(e.target.value)} />
                <Button className="bg-gradient-primary" onClick={() => {
                  if (!selected) return;
                  if (partnerId === 'all') return;
                  const cap = parseInt(capacity, 10);
                  const bok = parseInt(booked, 10);
                  if (Number.isNaN(cap) || Number.isNaN(bok)) return;
                  const date = selected.toISOString().slice(0,10);
                  mockdb.upsertAgenda({ partnerId, date, capacity: cap, booked: bok });
                  setCapacity(""); setBooked("");
                }}>Salvar</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


