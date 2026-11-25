"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Copy, Download, Share2, ArrowUpRight, QrCode } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type Props = {
  project: { name: string; url: string } | null
  onClose: () => void
}

export function ShareSiteDialog({ project, onClose }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState("")
  const name = project?.name ?? ""
  const url = project?.url ?? ""

  useEffect(() => {
    let cancelled = false
    setReady(false)
    setError("")
    if (!project) return
    async function draw() {
      try {
        const parsed = new URL(url)
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error()
        const qr = document.createElement("canvas")
        await QRCode.toCanvas(qr, url, {
          width: 480, margin: 4, errorCorrectionLevel: "M",
          color: { dark: "#101512", light: "#FFFFFF" },
        })
        if (cancelled || !canvas.current) return
        const ctx = canvas.current.getContext("2d")
        if (!ctx) throw new Error()
        ctx.fillStyle = "#09090B"
        ctx.fillRect(0, 0, 720, 900)
        function box(x: number, y: number, w: number, h: number, r: number, color: string) {
          ctx!.fillStyle = color
          ctx!.beginPath()
          ctx!.roundRect(x, y, w, h, r)
          ctx!.fill()
        }
        function text(value: string, y: number, font: string, color: string, max = 620) {
          ctx!.font = font
          ctx!.fillStyle = color
          ctx!.textAlign = "center"
          let label = value
          while (label.length > 1 && ctx!.measureText(label).width > max) label = label.slice(0, -1)
          ctx!.fillText(label === value ? label : label.slice(0, -1) + "…", 360, y)
        }
        box(24, 24, 672, 852, 36, "#27272A")
        box(26, 26, 668, 848, 35, "#111114")
        // Mascote NIMO: antena, orelhas, visor e olhos.
        box(356, 48, 8, 28, 4, "#344139")
        box(351, 43, 18, 18, 9, "#B8F36B")
        box(280, 95, 20, 35, 9, "#344139")
        box(420, 95, 20, 35, 9, "#344139")
        box(291, 70, 138, 88, 34, "#344139")
        box(296, 75, 128, 78, 30, "#1B241F")
        box(307, 87, 106, 58, 22, "#080D0B")
        box(319, 98, 30, 29, 10, "#B8F36B")
        box(371, 98, 30, 29, 10, "#B8F36B")
        box(324, 102, 9, 4, 2, "#E2FFAE")
        box(376, 102, 9, 4, 2, "#E2FFAE")
        ctx.strokeStyle = "#B8F36B"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(350, 133)
        ctx.quadraticCurveTo(360, 141, 370, 133)
        ctx.stroke()
        text("nimo/dev", 194, "bold 26px sans-serif", "#B8F36B")
        text(name, 245, "bold 34px sans-serif", "#FFFFFF")
        text("Escaneie para acessar o projeto", 279, "20px sans-serif", "#A1A1AA")
        box(100, 300, 520, 520, 28, "#B8F36B")
        box(112, 312, 496, 496, 18, "#FFFFFF")
        ctx.drawImage(qr, Math.round((720 - qr.width) / 2), 320 + Math.round((480 - qr.height) / 2))
        text(parsed.host, 850, "20px sans-serif", "#A1A1AA")
        setReady(true)
      } catch {
        if (!cancelled) setError("Não foi possível gerar o QR Code. Confira o endereço do site.")
      }
    }
    // Aguarda o conteúdo do Dialog ser montado no portal.
    const timer = window.setTimeout(() => void draw(), 100)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [name, url, project])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copiado!")
    } catch { toast.error("Não foi possível copiar o link.") }
  }

  function download() {
    if (!canvas.current || !ready) return
    const a = document.createElement("a")
    a.href = canvas.current.toDataURL("image/png")
    a.download = `nimo-${name.replace(/[^a-zA-Z0-9-]/g, "-")}.png`
    a.click()
  }

  async function share() {
    if (!navigator.share) { await copy(); return }
    try { await navigator.share({ title: name, url }) }
    catch (e) {
      if (!(e instanceof Error && e.name === "AbortError")) toast.error("Não foi possível compartilhar.")
    }
  }

  return (
    <Dialog open={!!project} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl border-border/60 sm:max-w-sm">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/10">
            <QrCode className="size-5 text-lime-400" />
          </div>
          <DialogTitle>Compartilhar site</DialogTitle>
          <DialogDescription>Leve seu projeto para qualquer lugar.</DialogDescription>
        </DialogHeader>
        <canvas ref={canvas} width={720} height={900} aria-label={`Cartão QR Code de ${name}`}
          className={`mx-auto w-full max-w-[260px] rounded-xl ${ready ? "" : "hidden"}`} />
        {!ready && !error && <p className="py-8 text-center text-xs text-muted-foreground">Gerando QR Code...</p>}
        {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-3">
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{url}</span>
          <Button variant="ghost" size="icon" onClick={copy} aria-label="Copiar link"><Copy className="size-4" /></Button>
        </div>
        <Button disabled={!ready} onClick={download} className="w-full rounded-xl bg-lime-400 text-black hover:bg-lime-300">
          <Download className="size-4" /> Baixar cartão PNG
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" disabled={!ready} onClick={share}><Share2 className="size-4" /> Compartilhar</Button>
          <Button variant="outline" disabled={!ready} onClick={() => window.open(url, "_blank", "noopener,noreferrer")}><ArrowUpRight className="size-4" /> Abrir site</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
