"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  Clipboard,
  Cpu,
  ExternalLink,
  Globe2,
  Info,
  Link2,
  Monitor,
  RefreshCcw,
  Router,
  Save,
  ShieldCheck,
  Smartphone,
  Wifi,
  WifiOff,
  Activity,
} from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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
import { PairFormData, pairSchema, SyncFormData, syncSchema, WifiFormData, wifiSchema } from "../schema/setup-schema"



type Step = "prepare" | "wifi" | "pair" | "sync" | "diagnostic"

interface Site {
  id: string
  name: string
  url: string
}

interface NimoSetupTabsProps {
  sites?: Site[]
}

const defaultSites: Site[] = [
  {
    id: "1",
    name: "Meu Site",
    url: "https://meusite.com.br",
  },
  {
    id: "2",
    name: "AcertouGanhou",
    url: "https://acertouganhou.site",
  },
]

const steps: {
  id: Step
  number: string
  label: string
}[] = [
  { id: "prepare", number: "01", label: "Preparar" },
  { id: "wifi", number: "02", label: "Wi-Fi" },
  { id: "pair", number: "03", label: "Vincular" },
  { id: "sync", number: "04", label: "Sincronizar" },
  { id: "diagnostic", number: "05", label: "Diagnóstico" },
]

const inputClass =
  "h-11 rounded-xl border-border/60 bg-muted/20 px-3 text-sm shadow-none focus-visible:border-lime-400/30 focus-visible:ring-lime-400/10"

const primaryButton =
  "h-10 gap-2 rounded-xl bg-lime-400 px-5 text-xs font-semibold text-black shadow-none hover:bg-lime-300"

const secondaryButton =
  "h-10 gap-2 rounded-xl border-border/60 bg-muted/20 px-5 text-xs shadow-none hover:bg-muted/40"

function StepCard({
  icon: Icon,
  number,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  number: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="gap-0 rounded-2xl border-border/60 bg-card/60 py-0 shadow-none">
      <CardHeader className="space-y-4 px-5 pt-6 pb-0 sm:px-6">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-lime-400/15 bg-lime-400/10">
          <Icon className="size-5 text-lime-400" strokeWidth={1.7} />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-lime-400">
            ETAPA {number} / 05
          </span>

          <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </CardTitle>

          <p className="max-w-xl text-xs leading-6 text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-5 pt-6 pb-6 sm:px-6">
        {children}
      </CardContent>
    </Card>
  )
}

function StatusRow({
  label,
  value,
  status = "success",
}: {
  label: string
  value: string
  status?: "success" | "warning" | "error"
}) {
  const colors = {
    success: "bg-lime-400",
    warning: "bg-amber-400",
    error: "bg-red-400",
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 py-4 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`size-2 shrink-0 rounded-full ${colors[status]}`}
        />

        <span className="text-xs font-medium sm:text-sm">
          {label}
        </span>
      </div>

      <span className="text-right text-[11px] text-muted-foreground">
        {value}
      </span>
    </div>
  )
}

function SetupNote({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-400/15 bg-amber-400/5 p-4">
      <Info className="mt-0.5 size-4 shrink-0 text-amber-400" />

      <p className="text-xs leading-6 text-amber-200/80">
        {children}
      </p>
    </div>
  )
}

function SuccessMessage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl border border-lime-400/20 bg-lime-400/5 p-4">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-lime-400" />

      <p className="text-xs leading-6 text-lime-300">
        {children}
      </p>
    </div>
  )
}

export function NimoSetupTabs({
  sites = defaultSites,
}: NimoSetupTabsProps) {
  const [activeStep, setActiveStep] = useState<Step>("prepare")

  const [wifiConnected, setWifiConnected] = useState(false)
  const [devicePaired, setDevicePaired] = useState(false)
  const [deviceSynced, setDeviceSynced] = useState(false)

  const wifiForm = useForm<WifiFormData>({
    resolver: zodResolver(wifiSchema),
    defaultValues: {
      ssid: "",
      password: "",
    },
  })

  const pairForm = useForm<PairFormData>({
    resolver: zodResolver(pairSchema),
    defaultValues: {
      code: "",
    },
  })

  const syncForm = useForm<SyncFormData>({
    resolver: zodResolver(syncSchema),
    defaultValues: {
      deviceName: "NIMO da mesa",
      siteId: sites[0]?.id ?? "",
      interval: "60",
    },
  })

  function goToStep(step: Step) {
    console.log("[NIMO] Navegando para etapa:", step)

    setActiveStep(step)
  }

  function handleWifi(data: WifiFormData) {
    // Nunca registrar a senha do Wi-Fi no console.
    console.log("[NIMO] Wi-Fi (simulação):", {
      ssid: data.ssid,
      simulated: true,
    })

    setWifiConnected(true)

    // Limpa a senha após a simulação.
    wifiForm.setValue("password", "")
  }

  async function handlePair(data: PairFormData) {
    try {
      const code = data.code.replace(/^NIMO-/, "")
  
      const syncValues = syncForm.getValues()
  
      const response = await fetch("/api/devices/pair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          name: syncValues.deviceName,
          siteId: syncValues.siteId,
          syncInterval: Number(syncValues.interval),
        }),
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.error ?? "Erro ao vincular NIMO.")
      }
  
      setDevicePaired(true)
      setActiveStep("sync")
    } catch (error) {
      console.error("[NIMO] Erro ao parear:", error)
    }
  }

  async function handleSync(data: SyncFormData) {
    try {
      const devicesResponse = await fetch("/api/devices", {
        cache: "no-store",
      })
  
      if (!devicesResponse.ok) {
        throw new Error("Erro ao consultar dispositivos.")
      }
  
      const devicesData = await devicesResponse.json()
  
      const device = devicesData.devices?.[0]
  
      if (!device) {
        throw new Error("Nenhum dispositivo vinculado.")
      }
  
      const response = await fetch(`/api/devices/${device.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.deviceName,
          siteId: data.siteId,
          syncInterval: Number(data.interval),
        }),
      })
  
      if (!response.ok) {
        throw new Error("Erro ao sincronizar NIMO.")
      }
  
      setDeviceSynced(true)
    } catch (error) {
      console.error("[NIMO] Erro na sincronização:", error)
    }
  }
  async function copyPortal() {
    const address = "http://192.168.4.1"

    try {
      await navigator.clipboard.writeText(address)

      console.log("[NIMO] Portal copiado:", address)
    } catch {
      console.log("[NIMO] Copie manualmente:", address)
    }
  }

  function resetSetup() {
    console.log("[NIMO] Reiniciando configuração")

    setWifiConnected(false)
    setDevicePaired(false)
    setDeviceSynced(false)

    wifiForm.reset()
    pairForm.reset()
    syncForm.reset()

    setActiveStep("prepare")
  }

  return (
    <div className="w-full">
      <Tabs
        value={activeStep}
        onValueChange={(value) => goToStep(value as Step)}
        className="w-full gap-0"
      >
        {/* NAVEGAÇÃO */}
        <div className="mb-6 w-full overflow-x-auto pb-2">
          <TabsList
            className="
              flex h-auto w-max min-w-full
              justify-start gap-2
              rounded-none bg-transparent p-0
            "
          >
            {steps.map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                className="
                  gap-2
                  
                  bg-card/60 px-4
                  text-xs font-medium
                  text-muted-foreground
                  shadow-none
                  transition-all
                  hover:border-lime-400/20
                  hover:text-foreground
                  data-[state=active]:border-lime-400/30
                  data-[state=active]:bg-lime-400/10
                  data-[state=active]:text-lime-400
                  
                "
              >
                <span className="font-mono text-[10px]">
                  {step.number}
                </span>

                <span>{step.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ETAPA 01 */}
        <TabsContent value="prepare">
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
            <StepCard
              icon={Cpu}
              number="01"
              title="Vamos preparar o dispositivo"
              description="Antes de começar, confira se seu NIMO possui o firmware com suporte ao modo de configuração Wi-Fi."
            >
              <div className="space-y-5">
                {[
                  "Ligue o NIMO utilizando um cabo USB.",
                  "Aguarde a tentativa de conexão com uma rede conhecida.",
                  "Se não houver rede disponível, o NIMO deverá iniciar o modo de configuração.",
                  "Conecte seu celular ou notebook à rede temporária criada pelo dispositivo.",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 font-mono text-xs text-lime-400">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p className="pt-1 text-xs leading-6 text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => goToStep("wifi")}
                  className={primaryButton}
                >
                  Continuar
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </StepCard>

            <Card className="gap-0 rounded-2xl border-border/60 bg-card/60 py-0 shadow-none">
              <CardHeader className="px-5 pt-6 sm:px-6">
                <CardTitle className="text-sm font-semibold">
                  O que você vai precisar
                </CardTitle>

                <p className="text-xs text-muted-foreground">
                  Confira os requisitos antes de começar.
                </p>
              </CardHeader>

              <CardContent className="px-5 pb-6 sm:px-6">
                <StatusRow
                  label="NIMO ESP32 com tela touch"
                  value="Hardware"
                />

                <StatusRow
                  label="Celular ou notebook"
                  value="Navegador"
                />

                <StatusRow
                  label="Rede Wi-Fi 2,4 GHz"
                  value="Internet"
                />

                <StatusRow
                  label="Firmware com portal Wi-Fi"
                  value="A implementar"
                  status="warning"
                />

                <SetupNote>
                  O ESP32 tradicional utiliza redes Wi-Fi de 2,4 GHz.
                  Redes exclusivamente 5 GHz não são compatíveis.
                </SetupNote>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ETAPA 02 */}
        <TabsContent value="wifi">
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
            <StepCard
              icon={Wifi}
              number="02"
              title="Conecte o NIMO ao Wi-Fi"
              description="Quando o dispositivo entrar no modo de configuração, conecte seu celular à rede temporária criada pelo NIMO."
            >
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-3">
                  <Wifi className="size-4 text-lime-400" />

                  <span className="font-mono text-xs font-medium">
                    NIMO-Setup-82A1
                  </span>
                </div>

                <Badge
                  variant="outline"
                  className="border-amber-400/20 bg-amber-400/5 text-[10px] text-amber-400"
                >
                  Rede de exemplo
                </Badge>
              </div>

              <div className="mt-5 space-y-2">
                <Label className="text-xs">
                  Endereço do portal local
                </Label>

                <Input
                  readOnly
                  value="http://192.168.4.1"
                  className={inputClass}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={copyPortal}
                  className={secondaryButton}
                >
                  <Clipboard className="size-4" />
                  Copiar endereço
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    console.log(
                      "[NIMO] Endereço do portal: http://192.168.4.1"
                    )
                    window.open(
                      "http://192.168.4.1",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }}
                  className={primaryButton}
                >
                  Abrir portal local
                  <ExternalLink className="size-4" />
                </Button>
              </div>

              <SetupNote>
                O portal só estará disponível quando o celular estiver
                conectado à rede temporária do NIMO e o firmware
                estiver executando o servidor local.
              </SetupNote>
            </StepCard>

            <Card className="gap-0 rounded-2xl border-border/60 bg-card/60 py-0 shadow-none">
              <CardHeader className="space-y-2 px-5 pt-6 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm font-semibold">
                    Prévia do portal
                  </CardTitle>

                  <Badge variant="secondary" className="text-[10px]">
                    Simulação
                  </Badge>
                </div>

                <p className="text-xs leading-6 text-muted-foreground">
                  Simule o preenchimento da rede Wi-Fi do dispositivo.
                </p>
              </CardHeader>

              <CardContent className="px-5 pb-6 sm:px-6">
                <form
                  onSubmit={wifiForm.handleSubmit(handleWifi)}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="ssid" className="text-xs">
                      Rede Wi-Fi (SSID)
                    </Label>

                    <Input
                      id="ssid"
                      placeholder="Ex.: WiFi-Faculdade"
                      maxLength={32}
                      autoComplete="off"
                      className={inputClass}
                      {...wifiForm.register("ssid")}
                    />

                    {wifiForm.formState.errors.ssid && (
                      <p className="text-xs text-red-400">
                        {wifiForm.formState.errors.ssid.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wifi-password" className="text-xs">
                      Senha da rede
                    </Label>

                    <Input
                      id="wifi-password"
                      type="password"
                      placeholder="Senha do Wi-Fi"
                      autoComplete="off"
                      className={inputClass}
                      {...wifiForm.register("password")}
                    />

                    {wifiForm.formState.errors.password && (
                      <p className="text-xs text-red-400">
                        {wifiForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className={primaryButton}>
                    <Wifi className="size-4" />
                    Simular conexão
                  </Button>
                </form>

                {wifiConnected && (
                  <SuccessMessage>
                    Conexão simulada com sucesso! Nenhuma conexão
                    real foi estabelecida com o ESP32.
                  </SuccessMessage>
                )}

                <p className="mt-5 text-[11px] leading-5 text-muted-foreground">
                  A senha não será enviada ao dispositivo nem registrada
                  no console durante esta simulação.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => goToStep("prepare")}
              className={secondaryButton}
            >
              <ArrowLeft className="size-4" />
              Voltar
            </Button>

            <Button
              onClick={() => goToStep("pair")}
              className={primaryButton}
            >
              Próxima etapa
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ETAPA 03 */}
        <TabsContent value="pair">
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
            <StepCard
              icon={Link2}
              number="03"
              title="Vincule à sua conta"
              description="Após conectar à internet, o NIMO solicitará um código temporário ao servidor para associar o dispositivo à sua conta."
            >
              <form
                onSubmit={pairForm.handleSubmit(handlePair)}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="pair-code" className="text-xs">
                    Código exibido no NIMO
                  </Label>

                  <Input
                    id="pair-code"
                   placeholder="NIMO-12345678"
                    maxLength={13}
                    autoComplete="off"
                    className={`${inputClass} font-mono uppercase tracking-wider`}
                    {...pairForm.register("code")}
                  />

                  {pairForm.formState.errors.code && (
                    <p className="text-xs text-red-400">
                      {pairForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className={primaryButton}>
                  Simular vinculação
                  <ArrowRight className="size-4" />
                </Button>
              </form>

              {devicePaired && (
                <SuccessMessage>
                  Vinculação simulada com sucesso. Na versão real,
                  o servidor deverá validar a validade e a utilização
                  única do código.
                </SuccessMessage>
              )}
            </StepCard>

            <Card className="gap-0 rounded-2xl border-border/60 bg-card/60 py-0 shadow-none">
              <CardHeader className="space-y-2 px-5 pt-6 sm:px-6">
                <CardTitle className="text-sm font-semibold">
                  Exemplo na tela do NIMO
                </CardTitle>

                <p className="text-xs text-muted-foreground">
                  Código ilustrativo, sem validade real.
                </p>
              </CardHeader>

              <CardContent className="px-5 pb-6 sm:px-6">
                <div className="rounded-2xl border border-dashed border-lime-400/25 bg-[#0a100b] px-4 py-8 text-center">
                  <span className="font-mono text-3xl font-bold tracking-[0.2em] text-lime-400 sm:text-4xl">
                    A7B2C3
                  </span>

                  <p className="mt-3 text-xs text-muted-foreground">
                    Código de demonstração
                  </p>
                </div>

                <div className="mt-4">
                  <StatusRow
                    label="Aguardando pareamento"
                    value="Demo"
                    status="warning"
                  />
                </div>

                <SetupNote>
                  Na implementação real, o código será gerado pelo
                  servidor e exibido pelo ESP32. Nunca utilize códigos
                  fixos para autenticar dispositivos em produção.
                </SetupNote>
              </CardContent>
            </Card>
          </div>

          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => goToStep("wifi")}
              className={secondaryButton}
            >
              <ArrowLeft className="size-4" />
              Voltar
            </Button>

            <Button
              onClick={() => goToStep("sync")}
              className={primaryButton}
            >
              Próxima etapa
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ETAPA 04 */}
        <TabsContent value="sync">
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
            <StepCard
              icon={RefreshCcw}
              number="04"
              title="Escolha o site monitorado"
              description="Depois de vincular o NIMO, selecione um dos seus sites e personalize as preferências do dispositivo."
            >
              <form
                onSubmit={syncForm.handleSubmit(handleSync)}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="device-name" className="text-xs">
                    Nome do NIMO
                  </Label>

                  <Input
                    id="device-name"
                    placeholder="Ex.: NIMO da mesa"
                    className={inputClass}
                    {...syncForm.register("deviceName")}
                  />

                  {syncForm.formState.errors.deviceName && (
                    <p className="text-xs text-red-400">
                      {syncForm.formState.errors.deviceName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site-select" className="text-xs">
                    Site para monitorar
                  </Label>

                  <select
                    id="site-select"
                    className={`${inputClass} w-full`}
                    {...syncForm.register("siteId")}
                  >
                    <option value="">Selecione um site</option>

                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name} — {site.url}
                      </option>
                    ))}
                  </select>

                  {syncForm.formState.errors.siteId && (
                    <p className="text-xs text-red-400">
                      {syncForm.formState.errors.siteId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sync-interval" className="text-xs">
                    Intervalo de sincronização
                  </Label>

                  <select
                    id="sync-interval"
                    className={`${inputClass} w-full`}
                    {...syncForm.register("interval")}
                  >
                    <option value="15">15 segundos</option>
                    <option value="30">30 segundos</option>
                    <option value="60">60 segundos</option>
                  </select>

                  {syncForm.formState.errors.interval && (
                    <p className="text-xs text-red-400">
                      {syncForm.formState.errors.interval.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={sites.length === 0}
                  className={primaryButton}
                >
                  <Save className="size-4" />
                  Salvar configuração demo
                </Button>
              </form>

              {deviceSynced && (
                <SuccessMessage>
                  Configuração validada e simulada com sucesso.
                  A sincronização real dependerá da API e do firmware.
                </SuccessMessage>
              )}
            </StepCard>

            <Card className="gap-0 rounded-2xl border-border/60 bg-card/60 py-0 shadow-none">
              <CardHeader className="px-5 pt-6 sm:px-6">
                <CardTitle className="text-sm font-semibold">
                  Como os dados chegam ao NIMO?
                </CardTitle>

                <p className="text-xs text-muted-foreground">
                  Fluxo de comunicação planejado.
                </p>
              </CardHeader>

              <CardContent className="px-5 pb-6 sm:px-6">
                <StatusRow label="Seu site" value="URL pública" />
                <StatusRow label="Plataforma NIMO" value="Monitoramento" />
                <StatusRow label="API autenticada" value="JSON" />
                <StatusRow label="ESP32" value="Display" />

                <div className="mt-5 rounded-xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center gap-2">
                    <Globe2 className="size-4 text-lime-400" />

                    <span className="text-xs font-medium">
                      Monitoramento inteligente
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-6 text-muted-foreground">
                    O backend poderá verificar disponibilidade HTTP,
                    latência e incidentes. Para visitantes em tempo
                    real, será necessária uma integração de analytics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => goToStep("pair")}
              className={secondaryButton}
            >
              <ArrowLeft className="size-4" />
              Voltar
            </Button>

            <Button
              onClick={() => goToStep("diagnostic")}
              className={primaryButton}
            >
              Ver diagnóstico
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ETAPA 05 */}
        <TabsContent value="diagnostic">
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
            <StepCard
              icon={Activity}
              number="05"
              title="Diagnóstico de conexão"
              description="Acompanhe os resultados da simulação. Na versão real, esta área exibirá informações enviadas pelo dispositivo."
            >
              <StatusRow
                label="Wi-Fi"
                value={
                  wifiConnected
                    ? "Simulado: conectado"
                    : "Não verificado"
                }
                status={wifiConnected ? "success" : "warning"}
              />

              <StatusRow
                label="Pareamento"
                value={
                  devicePaired
                    ? "Simulado: vinculado"
                    : "Não vinculado"
                }
                status={devicePaired ? "success" : "warning"}
              />

              <StatusRow
                label="Configuração"
                value={
                  deviceSynced
                    ? "Simulado: configurado"
                    : "Pendente"
                }
                status={deviceSynced ? "success" : "warning"}
              />

              <StatusRow
                label="API real"
                value="Aguardando backend"
                status="warning"
              />

              <StatusRow
                label="Último heartbeat"
                value="Indisponível"
                status="warning"
              />

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={resetSetup}
                  className={secondaryButton}
                >
                  <RefreshCcw className="size-4" />
                  Reiniciar simulação
                </Button>
              </div>
            </StepCard>

            <Card className="gap-0 rounded-2xl border-border/60 bg-card/60 py-0 shadow-none">
              <CardHeader className="space-y-2 px-5 pt-6 sm:px-6">
                <CardTitle className="text-sm font-semibold">
                  Próximos passos técnicos
                </CardTitle>

                <p className="text-xs leading-6 text-muted-foreground">
                  Para transformar a demonstração em uma integração real,
                  precisaremos implementar:
                </p>
              </CardHeader>

              <CardContent className="px-5 pb-6 sm:px-6">
                <div className="space-y-4">
                  {[
                    "Access Point e portal local no firmware.",
                    "Armazenamento seguro das credenciais Wi-Fi.",
                    "Registro e pareamento na API.",
                    "Autenticação individual do dispositivo.",
                    "Heartbeat, reconexão e tratamento de falhas.",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 font-mono text-[10px] text-lime-400">
                        {index + 1}
                      </div>

                      <p className="pt-0.5 text-xs leading-6 text-muted-foreground">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <SetupNote>
                  Esta demonstração não detecta dispositivos físicos,
                  não configura redes reais e não realiza autenticação.
                </SetupNote>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}