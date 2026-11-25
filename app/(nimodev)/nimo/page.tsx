import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { NimoSetupBanner } from "./components/NimoSetupHero";
import { NimoSetupTabs } from "./components/NimoSetupTabs";

export default function nimoPage(){
    return(
        <div className="flex flex-col min-h-screen w-full max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between">
        <div className="space-y-3">
            <p className="text-xs  font-mono text-lima font-semibold tracking-wider">PRIMEIROS PASSOS / HARDWARE</p>
            <h1 className="text-4xl font-bold">
            Configure seu NIMO.
            </h1>
            <p className="text-sm text-muted-foreground">Da primeira conexão ao monitoramento do seu site, tudo em um só lugar.</p>
        </div>

        </div>
        <div className="h-fit space-y-10 mt-4">
            <NimoSetupBanner />
           
        </div>

        <main className="flex-1 mt-10 flex-col gap-6.5">
          <NimoSetupTabs />

        </main>
    </div>
    )
}