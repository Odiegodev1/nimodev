"use client"

import { useCallback, useEffect, useState } from "react"

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Cpu,
  Globe2,
  Info,
  Link2,
  Loader2,
  Monitor,
  RefreshCw,
  Save,
  ShieldCheck,
  Wifi,
  WifiOff,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"

interface Site {
  id: string
  name: string
  url: string
}

interface NimoDevice {
  id: string
  name: string
  hardwareId: string

  status: "ONLINE" | "OFFLINE" | "PENDING"

  syncInterval: number
  lastSeenAt: string | null
  firmwareVersion: string | null

  site: Site | null
}

interface NimoDevicesProps {
  onDeviceCreated?: () => void
}

interface PairResponse {
  success?: boolean
  device?: {
    id: string
    name: string
  }
  error?: string
}

const syncIntervals = [
  {
    value: "30",
    label: "30 segundos",
  },
  {
    value: "60",
    label: "1 minuto",
  },
  {
    value: "120",
    label: "2 minutos",
  },
  {
    value: "300",
    label: "5 minutos",
  },
]

const cardClass =
  "group gap-0 overflow-hidden rounded-2xl border border-border/60 bg-card/60 py-0 shadow-none transition-all duration-300 hover:border-lime-400/20 hover:bg-card"

const inputClass =
  "h-11 rounded-xl border-border/60 bg-muted/20 px-3 text-xs shadow-none focus-visible:border-lime-400/30 focus-visible:ring-lime-400/10"

const primaryButton =
  "h-11 w-full gap-2 rounded-xl bg-lime-400 text-xs font-semibold text-black shadow-none transition-all hover:bg-lime-300 disabled:opacity-50"

const secondaryButton =
  "h-11 w-full gap-2 rounded-xl border-border/60 bg-muted/20 text-xs font-semibold shadow-none transition-all hover:border-lime-400/20 hover:bg-lime-400/5 hover:text-lime-400"

async function readApiResponse<T>(
  response: Response
): Promise<T> {
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      result?.error ??
        `Erro na requisição (${response.status}).`
    )
  }

  return result as T
}

function formatLastSeen(value: string | null) {
  if (!value) {
    return "Nunca conectado"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível"
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function normalizePairCode(value: string) {
  const digits = value
    .toUpperCase()
    .replace(/^NIMO-?/, "")
    .replace(/\D/g, "")
    .slice(0, 8)

  return digits.length > 0 ? `NIMO-${digits}` : ""
}

export function NimoDevices({
  onDeviceCreated,
}: NimoDevicesProps) {
  const [devices, setDevices] = useState<NimoDevice[]>([])
  const [sites, setSites] = useState<Site[]>([])

  const [selectedDeviceId, setSelectedDeviceId] =
    useState<string>("")

  const [deviceName, setDeviceName] = useState("")
  const [selectedSite, setSelectedSite] = useState("")
  const [syncInterval, setSyncInterval] = useState("60")

  const [pairCode, setPairCode] = useState("")
  const [pairDeviceName, setPairDeviceName] =
    useState("Meu NIMO")
  const [pairSiteId, setPairSiteId] = useState("")
  const [pairSyncInterval, setPairSyncInterval] =
    useState("60")

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPairing, setIsPairing] = useState(false)

  const [loadError, setLoadError] = useState<string | null>(
    null
  )

  const selectedDevice =
    devices.find((device) => device.id === selectedDeviceId) ??
    null

  const connectedDevices = devices.filter(
    (device) => device.status === "ONLINE"
  ).length

  const loadData = useCallback(async () => {
    const [devicesResponse, sitesResponse] = await Promise.all([
      fetch("/api/device", {
        cache: "no-store",
      }),
      fetch("/api/sites", {
        cache: "no-store",
      }),
    ])

    const devicesData = await readApiResponse<{
      devices: NimoDevice[]
    }>(devicesResponse)

    const sitesData = await readApiResponse<{
      sites: Site[]
    }>(sitesResponse)

    const nextDevices = devicesData.devices ?? []
    const nextSites = sitesData.sites ?? []

    setDevices(nextDevices)
    setSites(nextSites)
    setLoadError(null)

    setSelectedDeviceId((current) => {
      if (
        current &&
        nextDevices.some((device) => device.id === current)
      ) {
        return current
      }

      return nextDevices[0]?.id ?? ""
    })

    setPairSiteId((current) => {
      if (
        current &&
        nextSites.some((site) => site.id === current)
      ) {
        return current
      }

      return nextSites[0]?.id ?? ""
    })
  }, [])

  const refreshData = useCallback(async () => {
    setRefreshing(true)

    try {
      await loadData()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar os dispositivos."

      setLoadError(message)

      console.error("[NIMO] Erro ao atualizar:", error)
    } finally {
      setRefreshing(false)
    }
  }, [loadData])

  useEffect(() => {
    let cancelled = false

    async function initialize() {
      try {
        await loadData()
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os dispositivos."

          setLoadError(message)
          toast.error(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void initialize()

    return () => {
      cancelled = true
    }
  }, [loadData])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return
      }

      void refreshData()
    }, 30_000)

    return () => {
      window.clearInterval(interval)
    }
  }, [refreshData])

  useEffect(() => {
    if (!selectedDevice) {
      setDeviceName("")
      setSelectedSite("")
      setSyncInterval("60")
      return
    }

    setDeviceName(selectedDevice.name)
    setSelectedSite(selectedDevice.site?.id ?? "")
    setSyncInterval(String(selectedDevice.syncInterval))
  }, [selectedDevice])

  async function handleSave() {
    if (!selectedDevice) {
      toast.error("Selecione um dispositivo.")
      return
    }

    if (deviceName.trim().length < 2) {
      toast.error("Informe um nome com pelo menos 2 caracteres.")
      return
    }

    if (!selectedSite) {
      toast.error("Selecione um site para monitorar.")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(
        `/api/device/${encodeURIComponent(selectedDevice.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: deviceName.trim(),
            siteId: selectedSite,
            syncInterval: Number(syncInterval),
          }),
        }
      )

      await readApiResponse<{ success: boolean }>(response)

      toast.success("Preferências salvas com sucesso!", {
        description:
          "O NIMO receberá as configurações na próxima sincronização.",
      })

      await loadData()
    } catch (error) {
      console.error("[NIMO] Erro ao salvar:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as preferências."
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handlePair() {
    const normalizedCode = pairCode.trim().toUpperCase()

    if (!/^NIMO-\d{8}$/.test(normalizedCode)) {
      toast.error("Código de pareamento inválido.", {
        description: "Utilize o formato NIMO-12345678.",
      })
      return
    }

    if (pairDeviceName.trim().length < 2) {
      toast.error("Informe o nome do dispositivo.")
      return
    }

    if (!pairSiteId) {
      toast.error("Selecione um site antes de vincular.")
      return
    }

    setIsPairing(true)

    try {
      const code = normalizedCode.replace(/^NIMO-/, "")

      const response = await fetch("/api/device/pair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          name: pairDeviceName.trim(),
          siteId: pairSiteId,
          syncInterval: Number(pairSyncInterval),
        }),
      })

      const result =
        await readApiResponse<PairResponse>(response)

      if (!result.device?.id) {
        throw new Error(
          "O servidor não retornou o dispositivo vinculado."
        )
      }

      setPairCode("")
      setSelectedDeviceId(result.device.id)

      toast.success("NIMO vinculado com sucesso!", {
        description:
          "Seu dispositivo foi associado à sua conta.",
      })

      await loadData()

      onDeviceCreated?.()
    } catch (error) {
      console.error("[NIMO] Erro no pareamento:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível vincular o dispositivo."
      )
    } finally {
      setIsPairing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-2xl border border-border/60 bg-card/40">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-7 animate-spin text-lime-400" />

          <p className="text-xs text-muted-foreground">
            Carregando seus dispositivos...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* RESUMO */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 px-5 py-4">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-lime-400" />

            <span className="text-xs text-muted-foreground">
              Dispositivos
            </span>

            <span className="font-mono text-sm font-semibold">
              {devices.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-lime-400" />

            <span className="text-xs text-muted-foreground">
              Online
            </span>

            <span className="font-mono text-sm font-semibold">
              {connectedDevices}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void refreshData()}
          disabled={refreshing}
          className="gap-2 rounded-xl border-border/60 text-xs"
        >
          <RefreshCw
            className={`size-3.5 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          Atualizar
        </Button>
      </div>

      {loadError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-red-400" />

          <p className="text-xs leading-6 text-red-300">
            {loadError}
          </p>
        </div>
      )}

      {/* LISTAGEM DOS DISPOSITIVOS */}
      {devices.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              Dispositivos vinculados
            </h2>

            <span className="text-xs text-muted-foreground">
              Selecione um dispositivo para configurar
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {devices.map((device) => {
              const isSelected =
                selectedDeviceId === device.id

              const online = device.status === "ONLINE"

              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={`
                    group flex flex-col gap-4 rounded-2xl
                    border p-4 text-left
                    transition-all duration-200
                    ${
                      isSelected
                        ? "border-lime-400/40 bg-lime-400/5"
                        : "border-border/60 bg-card/40 hover:border-lime-400/20 hover:bg-card/70"
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`
                        flex size-10 items-center justify-center
                        rounded-xl border
                        ${
                          isSelected
                            ? "border-lime-400/20 bg-lime-400/10"
                            : "border-border/60 bg-muted/30"
                        }
                      `}
                    >
                      <Monitor
                        className={`size-5 ${
                          isSelected
                            ? "text-lime-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        online
                          ? "gap-1.5 rounded-lg border-lime-400/20 bg-lime-400/5 text-[10px] text-lime-400"
                          : "gap-1.5 rounded-lg border-border/60 bg-muted/20 text-[10px] text-muted-foreground"
                      }
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          online
                            ? "bg-lime-400"
                            : "bg-zinc-500"
                        }`}
                      />

                      {online ? "Online" : "Offline"}
                    </Badge>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-semibold">
                      {device.name}
                    </p>

                    <p className="truncate font-mono text-[10px] text-muted-foreground">
                      {device.hardwareId}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border-t border-border/50 pt-3">
                    <Globe2 className="size-3.5 text-muted-foreground" />

                    <span className="truncate text-xs text-muted-foreground">
                      {device.site?.name ?? "Nenhum site"}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* CARDS PRINCIPAIS */}
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        {/* CARD 1 — DISPOSITIVO */}
        <Card className={cardClass}>
          <CardHeader className="space-y-5 px-5 pt-5 pb-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-lime-400/15 bg-lime-400/10">
                  <Monitor
                    className="size-5 text-lime-400"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-sm font-semibold tracking-tight">
                    {selectedDevice?.name ?? "Nenhum NIMO conectado"}
                  </CardTitle>

                  <p className="text-xs text-muted-foreground">
                    Gerencie seu dispositivo
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className={
                  selectedDevice?.status === "ONLINE"
                    ? "gap-2 rounded-lg border-lime-400/15 bg-lime-400/5 px-2.5 py-1.5 text-[11px] font-medium text-lime-400"
                    : "gap-2 rounded-lg border-border/60 bg-muted/20 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground"
                }
              >
                <span
                  className={`relative inline-flex size-2 rounded-full ${
                    selectedDevice?.status === "ONLINE"
                      ? "bg-lime-400"
                      : "bg-zinc-500"
                  }`}
                />

                {selectedDevice?.status === "ONLINE"
                  ? "Online"
                  : "Offline"}
              </Badge>
            </div>

            {/* INFORMAÇÕES DO DISPOSITIVO */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Cpu className="size-4 shrink-0 text-muted-foreground" />

                <div className="min-w-0 space-y-1">
                  <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    ID do dispositivo
                  </p>

                  <p className="truncate font-mono text-xs font-medium">
                    {selectedDevice?.hardwareId ?? "Não vinculado"}
                  </p>
                </div>
              </div>

              {selectedDevice?.status === "ONLINE" ? (
                <Wifi className="size-4 shrink-0 text-lime-400" />
              ) : (
                <WifiOff className="size-4 shrink-0 text-muted-foreground" />
              )}
            </div>

            {selectedDevice && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/50 bg-muted/10 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock3 className="size-3.5 text-muted-foreground" />

                    <span className="text-[10px] text-muted-foreground">
                      Último contato
                    </span>
                  </div>

                  <p className="text-xs font-medium">
                    {formatLastSeen(selectedDevice.lastSeenAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-border/50 bg-muted/10 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Activity className="size-3.5 text-muted-foreground" />

                    <span className="text-[10px] text-muted-foreground">
                      Firmware
                    </span>
                  </div>

                  <p className="truncate font-mono text-xs font-medium">
                    {selectedDevice.firmwareVersion ?? "Não informado"}
                  </p>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="flex flex-1 flex-col px-5 pt-6 pb-5">
            {selectedDevice ? (
              <>
                <div className="flex-1 space-y-5">
                  {/* SITE */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="device-site"
                      className="text-xs font-medium"
                    >
                      Site exibido no dispositivo
                    </Label>

                    <Select
  value={selectedSite}
  onValueChange={(value) => {
    setSelectedSite(value ?? "")
  }}
>
  <SelectTrigger
    id="device-site"
    className="h-11! w-full rounded-xl border-border/60 bg-muted/20 px-3 text-xs shadow-none"
  >
    <div className="flex min-w-0 items-center gap-2">
      <Globe2 className="size-3.5 shrink-0 text-muted-foreground" />

      <span className="truncate text-xs">
        {sites.find((site) => site.id === selectedSite)?.name ??
          "Selecione um site"}
      </span>
    </div>
  </SelectTrigger>

  <SelectContent className="rounded-xl dark">
    {sites.map((site) => (
      <SelectItem
        key={site.id}
        value={site.id}
        className="text-xs"
      >
        {site.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                    <p className="text-[11px] text-muted-foreground">
                      O NIMO exibirá informações do projeto selecionado.
                    </p>
                  </div>

                  {/* NOME */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="device-name"
                      className="text-xs font-medium"
                    >
                      Nome do dispositivo
                    </Label>

                    <Input
                      id="device-name"
                      value={deviceName}
                      onChange={(event) =>
                        setDeviceName(event.target.value)
                      }
                      placeholder="Ex.: NIMO do escritório"
                      maxLength={50}
                      className={inputClass}
                    />
                  </div>

                  {/* INTERVALO */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="device-interval"
                      className="text-xs font-medium"
                    >
                      Intervalo de sincronização
                    </Label>

                    <Select
                      value={syncInterval}
                      onValueChange={(value) => {
                        if (value !== null) {
                          setSyncInterval(value)
                        }
                      }}
                    >
                      <SelectTrigger
                        id="device-interval"
                        className="h-11! w-full rounded-xl border-border/60 bg-muted/20 px-3 text-xs shadow-none"
                      >
                        <SelectValue placeholder="Selecione o intervalo" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl dark">
                        {syncIntervals.map((interval) => (
                          <SelectItem
                            key={interval.value}
                            value={interval.value}
                          >
                            {interval.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <p className="text-[11px] text-muted-foreground">
                      Define a frequência com que o dispositivo
                      consulta o servidor.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => void handleSave()}
                  disabled={
                    isSaving ||
                    !deviceName.trim() ||
                    !selectedSite
                  }
                  className={`mt-6 ${primaryButton}`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Salvar preferências
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/20">
                  <Monitor className="size-6 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">
                    Nenhum dispositivo vinculado
                  </h3>

                  <p className="max-w-xs text-xs leading-6 text-muted-foreground">
                    Conecte seu primeiro NIMO utilizando o código
                    exibido na tela do ESP32.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARD 2 — PAREAMENTO */}
        <Card className={cardClass}>
          <CardHeader className="space-y-4 px-5 pt-5 pb-0">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
                <Link2
                  className="size-5 text-lime-400"
                  strokeWidth={1.8}
                />
              </div>

              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold tracking-tight">
                  Vincular um novo NIMO
                </CardTitle>

                <p className="text-xs text-muted-foreground">
                  Conecte outro dispositivo à sua conta
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Quando o hardware estiver configurado, você poderá
              pareá-lo com sua conta utilizando um código temporário
              exibido na tela do NIMO.
            </p>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col px-5 pt-6 pb-5">
            <div className="flex-1 space-y-5">
              {/* CÓDIGO */}
              <div className="space-y-2">
                <Label
                  htmlFor="pair-code"
                  className="text-xs font-medium"
                >
                  Código de pareamento
                </Label>

                <div className="relative">
                  <Input
                    id="pair-code"
                    value={pairCode}
                    onChange={(event) =>
                      setPairCode(
                        normalizePairCode(event.target.value)
                      )
                    }
                    placeholder="NIMO-12345678"
                    maxLength={13}
                    autoComplete="off"
                    spellCheck={false}
                    className={`${inputClass} pr-10 font-mono tracking-wider uppercase`}
                  />

                  <Link2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Digite o código mostrado na tela do dispositivo.
                  Ele expira após 10 minutos.
                </p>
              </div>

              {/* NOME DO NOVO NIMO */}
              <div className="space-y-2">
                <Label
                  htmlFor="pair-device-name"
                  className="text-xs font-medium"
                >
                  Nome do novo NIMO
                </Label>

                <Input
                  id="pair-device-name"
                  value={pairDeviceName}
                  onChange={(event) =>
                    setPairDeviceName(event.target.value)
                  }
                  placeholder="Ex.: NIMO da mesa"
                  maxLength={50}
                  className={inputClass}
                />
              </div>

              {/* SITE DO NOVO NIMO */}
              <div className="space-y-2">
                <Label
                  htmlFor="pair-device-site"
                  className="text-xs font-medium"
                >
                  Site para monitorar
                </Label>

                <Select
  value={pairSiteId || undefined}
  onValueChange={(value) => {
    if (value !== null) {
      setPairSiteId(value)
    }
  }}
>
  <SelectTrigger
    id="pair-device-site"
    className="h-11! w-full rounded-xl border-border/60 bg-muted/20 px-3 text-xs shadow-none"
  >
    <span className="flex min-w-0 items-center gap-2">
      <Globe2 className="size-3.5 shrink-0 text-muted-foreground" />

      <span className="truncate">
        {sites.find((site) => site.id === pairSiteId)?.name ??
          "Selecione um site"}
      </span>
    </span>
  </SelectTrigger>

  <SelectContent className="rounded-xl dark">
    {sites.map((site) => (
      <SelectItem
        key={site.id}
        value={site.id}
        className="text-xs"
      >
        {site.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                {sites.length === 0 && (
                  <p className="text-[11px] text-amber-400">
                    Cadastre um site antes de vincular seu NIMO.
                  </p>
                )}
              </div>

              {/* INTERVALO DO NOVO NIMO */}
              <div className="space-y-2">
                <Label
                  htmlFor="pair-device-interval"
                  className="text-xs font-medium"
                >
                  Intervalo de sincronização
                </Label>

                <Select
                  value={pairSyncInterval}
                  onValueChange={(value) => {
                    if (value !== null) {
                      setPairSyncInterval(value)
                    }
                  }}
                >
                  <SelectTrigger
                    id="pair-device-interval"
                    className="h-11! w-full rounded-xl border-border/60 bg-muted/20 px-3 text-xs shadow-none"
                  >
                    <SelectValue placeholder="Selecione o intervalo" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl dark">
                    {syncIntervals.map((interval) => (
                      <SelectItem
                        key={interval.value}
                        value={interval.value}
                      >
                        {interval.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* COMO FUNCIONA */}
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="size-4 text-lime-400" />

                  <span className="text-xs font-medium">
                    Como funciona?
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    "Ligue seu dispositivo NIMO.",
                    "Conecte-o à rede Wi-Fi.",
                    "Aguarde o código aparecer na tela.",
                    "Digite o código e selecione seu site.",
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background text-[10px] font-medium text-muted-foreground">
                        {index + 1}
                      </span>

                      <p className="pt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTÃO DE PAREAMENTO */}
            <Button
              onClick={() => void handlePair()}
              disabled={
                isPairing ||
                !/^NIMO-\d{8}$/.test(pairCode) ||
                !pairSiteId ||
                pairDeviceName.trim().length < 2
              }
              variant="outline"
              className={`mt-6 ${secondaryButton}`}
            >
              {isPairing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Link2 className="size-4" />
                  Vincular dispositivo
                  <ArrowRight className="ml-auto size-4" />
                </>
              )}
            </Button>

            {/* SEGURANÇA */}
            <div className="mt-4 flex items-start gap-2">
              <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

              <p className="text-[10px] leading-relaxed text-muted-foreground">
                O servidor valida o código temporário e verifica
                se o dispositivo ainda não está vinculado a outra
                conta.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RODAPÉ */}
      <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/10 px-4 py-3">
        <CheckCircle2 className="size-4 shrink-0 text-lime-400" />

        <p className="text-[11px] leading-5 text-muted-foreground">
          As preferências são armazenadas no servidor. O ESP32
          recebe as alterações automaticamente na próxima
          sincronização, quando estiver conectado.
        </p>
      </div>
    </div>
  )
}