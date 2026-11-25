"use client";

import { useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, CircleAlert, Globe, Search, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Incident = { id: string; site: string; path: string; code: number | null; title: string; severity: "critical" | "high" | "medium"; startedAt: string; resolvedAt: string | null; };
// Replace with authenticated API data. No fabricated incidents in production.
const initialIncidents: Incident[] = [];
const labels = { critical: "Crítico", high: "Alto", medium: "Médio" };
const tones = { critical: "text-red-400 bg-red-500/10", high: "text-orange-400 bg-orange-500/10", medium: "text-amber-400 bg-amber-500/10" };
const date = (value: string) => new Date(value).toLocaleString("pt-BR");

export default function AlertasPage() {
  const [incidents] = useState(initialIncidents);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [site, setSite] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [period, setPeriod] = useState("all");
  const [selected, setSelected] = useState<Incident | null>(null);
  const active = incidents.filter(i => !i.resolvedAt);
  const sites = [...new Set(incidents.map(i => i.site))];
  const filtered = useMemo(() => incidents.filter(i => {
    const matches = `${i.site} ${i.path} ${i.title} ${i.code ?? "timeout"}`.toLowerCase().includes(query.toLowerCase());
    return matches && (status === "all" || (status === "active" ? !i.resolvedAt : !!i.resolvedAt)) && (site === "all" || i.site === site) && (severity === "all" || i.severity === severity) && (period === "all" || Date.now() - new Date(i.startedAt).getTime() <= Number(period)*86400000);
  }).sort((a,b) => b.startedAt.localeCompare(a.startedAt)), [incidents, query, status, site, severity, period]);
  const stats = [
    { label: "Incidentes ativos", value: active.length, icon: Activity, color: "text-foreground" },
    { label: "Críticos ativos", value: active.filter(i => i.severity === "critical").length, icon: CircleAlert, color: "text-red-400" },
    { label: "Erros 404", value: incidents.filter(i => i.code === 404).length, icon: AlertTriangle, color: "text-amber-400" },
    { label: "Resolvidos", value: incidents.filter(i => i.resolvedAt).length, icon: CheckCircle2, color: "text-[#B8F36B]" },
  ];
  const selectClass = "h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground";
  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 p-4 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><Activity size={14}/> Monitoramento / Incidentes</div><h1 className="text-3xl font-semibold tracking-tight">Alertas</h1><p className="mt-2 text-sm text-muted-foreground">Acompanhe falhas e indisponibilidades dos seus sites.</p></div>
        <Badge variant="outline" className="gap-2 px-3 py-2 text-muted-foreground"><span className="size-2 rounded-full bg-amber-400"/> Integração pendente</Badge>
      </header>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({label,value,icon:Icon,color}) => <Card key={label} className="rounded-xl shadow-none"><CardContent className="p-5"><div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">{label}<Icon size={17} className={color}/></div><div className={`mt-4 text-3xl font-semibold tabular-nums ${color}`}>{value}</div></CardContent></Card>)}
      </div>
      <Card className="rounded-xl shadow-none"><CardContent className="space-y-5 p-5 sm:p-6">
        <div><h2 className="font-semibold">Histórico de incidentes</h2><p className="mt-1 text-sm text-muted-foreground">Erros HTTP e falhas de disponibilidade registrados.</p></div>
        <div className="flex flex-wrap gap-2"><div className="relative min-w-48 flex-1"><Search size={16} className="absolute left-3 top-3 text-muted-foreground"/><Input className="h-10 pl-9" placeholder="Buscar URL, site ou erro..." value={query} onChange={e => setQuery(e.target.value)}/></div>
          <select aria-label="Status" className={selectClass} value={status} onChange={e=>setStatus(e.target.value)}><option value="all">Todos os status</option><option value="active">Ativos</option><option value="resolved">Resolvidos</option></select>
          <select aria-label="Site" className={selectClass} value={site} onChange={e=>setSite(e.target.value)}><option value="all">Todos os sites</option>{sites.map(s=><option key={s}>{s}</option>)}</select>
          <select aria-label="Gravidade" className={selectClass} value={severity} onChange={e=>setSeverity(e.target.value)}><option value="all">Gravidade</option>{Object.entries(labels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
          <select aria-label="Período" className={selectClass} value={period} onChange={e=>setPeriod(e.target.value)}><option value="all">Todo o período</option><option value="1">24 horas</option><option value="7">7 dias</option><option value="30">30 dias</option></select>
        </div>
        {filtered.length === 0 ? <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center"><div className="mb-4 rounded-2xl bg-muted p-4"><ShieldCheck className="text-muted-foreground" size={30}/></div><h3 className="font-medium">{incidents.length ? "Nenhum resultado" : "Nenhum incidente registrado"}</h3><p className="mt-2 max-w-sm text-sm text-muted-foreground">{incidents.length ? "Experimente alterar os filtros." : "Os incidentes aparecerão aqui assim que a coleta de dados estiver integrada."}</p></div> : <div className="divide-y divide-border">{filtered.map(i=><button key={i.id} onClick={()=>setSelected(i)} className="flex w-full flex-wrap items-center gap-4 py-4 text-left hover:bg-muted/30"><div className={`rounded-lg p-3 ${tones[i.severity]}`}><AlertTriangle size={19}/></div><div className="min-w-0 flex-1"><p className="font-medium">{i.title}</p><p className="truncate text-xs text-muted-foreground">{i.site}{i.path} · {date(i.startedAt)}</p></div><Badge variant="outline" className={tones[i.severity]}>{labels[i.severity]}</Badge><Badge variant="outline">{i.resolvedAt ? "Resolvido" : "Ativo"}</Badge><ArrowUpRight size={16}/></button>)}</div>}
      </CardContent></Card>
      <div className="flex items-start gap-3 rounded-xl border p-4 text-sm text-muted-foreground"><Globe size={19} className="mt-0.5 shrink-0 text-[#B8F36B]"/><div><p className="font-medium text-foreground">Monitoramento de disponibilidade</p><p className="mt-1">Falhas de conexão e erros HTTP serão registrados automaticamente quando o serviço de monitoramento estiver ativo.</p></div></div>
      <Dialog open={!!selected} onOpenChange={open=>{if(!open)setSelected(null)}}><DialogContent><DialogHeader><DialogTitle>{selected?.title}</DialogTitle><DialogDescription>Detalhes do incidente</DialogDescription></DialogHeader>{selected && <div className="space-y-3 text-sm"><p>Site: {selected.site}</p><p className="break-all">Página: {selected.path}</p><p>HTTP: {selected.code ?? "Sem resposta"}</p><p>Início: {date(selected.startedAt)}</p><p>Recuperação: {selected.resolvedAt ? date(selected.resolvedAt) : "Pendente"}</p><p>Duração: {Math.max(0,Math.floor(((selected.resolvedAt ? new Date(selected.resolvedAt).getTime() : Date.now()) - new Date(selected.startedAt).getTime())/60000))} min</p><Button variant="outline" onClick={()=>setSelected(null)}>Fechar</Button></div>}</DialogContent></Dialog>
    </main>
  );
}
