import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { NimoDevices } from "./components/NimoDevices";

export default function DispositivoPage(){
    return(
        <div className="flex flex-col min-h-screen w-full max-w-7xl mx-auto p-8">
            <div className="flex items-center justify-between">
            <div className="space-y-3">
                <p className="text-xs  font-mono text-lima font-semibold tracking-wider">HARDWARE</p>
                <h1 className="text-4xl font-bold">
                Meus dispositivos
                </h1>
                <p className="text-sm text-muted-foreground">Conecte sua telinha ESP32 e escolha qual projeto ela vai acompanhar.</p>
            </div>

            <Button className="cursor-pointer h-10 rounded-2xl bg-lima hover:bg-lima/70"><PlusCircle /> Configurar novo NIMO</Button>
            </div>

            <main className="flex-1 mt-8 flex-col gap-6.5">
             
<NimoDevices />
            </main>
        </div>
    )
}