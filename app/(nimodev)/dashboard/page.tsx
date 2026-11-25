import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { StatsCard } from "./components/StatsCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { NimoDevice } from "@/components/NimoDevice";
import { NimoLiveCard } from "./components/Nimolivecard";
import { RecentActivity } from "./components/RecentActivity";
import { Suspense } from "react";
import { StatsCardSkeleton } from "./components/StatsCardSkeleton";
import { RecentActivitySkeleton } from "./components/RecentActivitySkeleton";

export default function Page(){
    return(
        <div className="flex flex-col min-h-screen w-full max-w-7xl mx-auto p-8">
            <div className="flex items-center justify-between">
            <div className="space-y-3">
                <p className="text-xs  font-mono text-lima font-semibold tracking-wider">PAINEL DE CONTROLE</p>
                <h1 className="text-4xl font-bold">
                Bom ter você por aqui 👋
                </h1>
                <p className="text-sm text-muted-foreground">Seu pequeno companheiro está de olho em tudo. Acompanhe seus sites em tempo real.</p>
            </div>

            <Button className="cursor-pointer h-10 rounded-2xl bg-lima hover:bg-lima/70"><PlusCircle /> Adicionar  Site</Button>
            </div>

            <main className="flex-1 mt-8 flex-col gap-6.5">
            <Suspense fallback={<StatsCardSkeleton />}>
        <StatsCard />
      </Suspense>
                <div className="mt-8 flex gap-4">
                   <NimoLiveCard />
                   <Suspense fallback={<RecentActivitySkeleton />}>
  <RecentActivity limit={6} />
</Suspense>
                </div>

            </main>
        </div>
    )
}