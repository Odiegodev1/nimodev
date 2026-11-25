import {
    Activity,
    ArrowUpRight,
    Wifi,
    WifiOff,
    Settings2,
  } from "lucide-react"
  
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
import { NimoDevice } from "@/components/NimoDevice"

  
  interface NimoLiveCardProps {
    connected?: boolean
    deviceName?: string
    lastSync?: string
  }
  
  export function NimoLiveCard({
    connected = true,
    deviceName = "NIMO DEV",
    lastSync = "Agora",
  }: NimoLiveCardProps) {
    return (
      <Card
        className="
        w-3/5
          group relative gap-0 overflow-hidden
          rounded-2xl border border-border/60
          bg-card/60 py-0 shadow-none
          transition-all duration-300
          hover:border-lime-400/20
          hover:bg-card
        "
      >
        {/* HEADER */}
        <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pt-5 pb-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
                <Activity className="size-4 text-lime-400" />
              </div>
  
              <CardTitle className="text-sm font-semibold tracking-tight">
                Seu NIMO, ao vivo
              </CardTitle>
            </div>
  
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                {connected && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-400 opacity-40" />
                )}
  
                <span
                  className={`relative inline-flex size-2 rounded-full ${
                    connected ? "bg-lime-400" : "bg-zinc-500"
                  }`}
                />
              </span>
  
              <span className="text-xs text-muted-foreground">
                {connected ? "Conectado" : "Desconectado"}
              </span>
  
              <span className="text-muted-foreground/30">•</span>
  
              <span className="text-xs text-muted-foreground">
                {deviceName}
              </span>
            </div>
          </div>
  
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="Configurações do dispositivo"
          >
            <Settings2 className="size-4" />
          </Button>
        </CardHeader>
  
        {/* VISUALIZAÇÃO DO NIMO */}
        <CardContent className="px-5 pt-5 pb-0">
          <div
            className="
              relative flex min-h-[280px]
              items-center justify-center
              overflow-hidden rounded-xl
              border border-border/50
              bg-[#0b0d0b]
              sm:min-h-[340px]
            "
          >
            {/* Efeito de iluminação */}
            <div
              className="
                pointer-events-none absolute
                inset-x-0 bottom-0 mx-auto
                h-40 w-40 rounded-full
                bg-lime-400/10 blur-[80px]
              "
            />
  
            {/* Grade discreta */}
            <div
              className="
                pointer-events-none absolute inset-0
                opacity-[0.035]
                [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
                [background-size:24px_24px]
              "
            />
  
            {/* Badge superior */}
            <div className="absolute top-4 left-4 z-10">
              <Badge
                variant="outline"
                className="gap-1.5 border-white/10 bg-black/30 text-[10px] font-medium text-zinc-400"
              >
                <span className="size-1.5 rounded-full bg-lime-400" />
                LIVE PREVIEW
              </Badge>
            </div>
  
            {/* Personagem */}
            <div
              className={`
                relative z-10 flex w-full
                items-center justify-center
                transition-all duration-500
                ${connected ? "opacity-100" : "opacity-30 grayscale"}
              `}
            >
              <NimoDevice />
            </div>
  
            {/* Indicador inferior */}
            <div className="absolute right-4 bottom-4 left-4 z-10 flex items-center justify-between">
              <span className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">
                ESP32 • Display 2.8"
              </span>
  
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                {connected ? (
                  <Wifi className="size-3 text-lime-400" />
                ) : (
                  <WifiOff className="size-3" />
                )}
  
                {connected ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        </CardContent>
  
        {/* FOOTER */}
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-2">
            <Activity className="size-3.5 text-muted-foreground" />
  
            <span className="text-xs text-muted-foreground">
              Última sincronização:
              <span className="ml-1 font-medium text-foreground">
                {lastSync}
              </span>
            </span>
          </div>
  
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-lime-400"
          >
            Ver detalhes
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </Card>
    )
  }