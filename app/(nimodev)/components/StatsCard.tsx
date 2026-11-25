"use client"

import useSWR from "swr"

import {
  Activity,
  Computer,
  GlobeCheck,
  LaptopMinimal,
  UserCheck,
  RefreshCw,
  CircleAlert,
  type LucideIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

import type { DashboardStats } from "@/lib/get-stats"

type StatItem = {
  id: number
  name: string
  value: string
  description: string
  icon: LucideIcon
  status?: "online" | "neutral" | "warning" | "offline"
}

const numberFormatter = new Intl.NumberFormat("pt-BR")

const percentageFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
})

const statusColors = {
  online: "bg-lime-400",
  warning: "bg-amber-400",
  offline: "bg-red-400",
  neutral: "bg-zinc-500",
}

async function fetcher(url: string): Promise<DashboardStats> {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
  })

  if (!response.ok) {
    throw new Error("Erro ao consultar estatísticas.")
  }

  return response.json()
}

export function StatsCard() {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<DashboardStats>(
    "/api/dashboard/stats",
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      dedupingInterval: 2000,
      keepPreviousData: true,
      errorRetryInterval: 5000,
    }
  )

  if (isLoading && !data) {
    return <StatsCardSkeleton />
  }

  if (!data) {
    return (
      <Card className="rounded-2xl border-border/60 bg-card/60 shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-red-400/10">
            <CircleAlert className="size-5 text-red-400" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              Não foi possível carregar os dados
            </p>

            <p className="text-xs text-muted-foreground">
              Verifique sua conexão e tente novamente.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={isValidating}
            onClick={() => void mutate()}
          >
            <RefreshCw
              className={`mr-2 size-3.5 ${
                isValidating ? "animate-spin" : ""
              }`}
            />

            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  const stats: StatItem[] = [
    {
      id: 1,
      name: "Sites monitorados",
      value: numberFormatter.format(data.totalSites),

      description:
        data.totalSites === 0
          ? "Nenhum site cadastrado"
          : `${data.onlineSites} online · ${data.offlineSites} offline`,

      icon: Computer,

      status:
        data.totalSites === 0
          ? "neutral"
          : data.offlineSites > 0
            ? "warning"
            : data.onlineSites > 0
              ? "online"
              : "neutral",
    },

    {
      id: 2,
      name: "Visitantes agora",

      value: numberFormatter.format(data.onlineVisitors),

      description:
        data.onlineVisitors > 0
          ? "Visitantes nos sites online"
          : "Nenhum visitante registrado",

      icon: UserCheck,

      status:
        data.onlineVisitors > 0
          ? "online"
          : "neutral",
    },

    {
      id: 3,
      name: "Disponibilidade",

      value:
        data.availability !== null
          ? percentageFormatter.format(
              data.availability / 100
            )
          : "—",

      description:
        data.availability === null
          ? "Aguardando verificações"
          : "Disponibilidade atual dos sites",

      icon: GlobeCheck,

      status:
        data.availability === null
          ? "neutral"
          : data.availability === 100
            ? "online"
            : data.availability === 0
              ? "offline"
              : "warning",
    },

  
  ]

  return (
    <div className="w-full space-y-3">
      {/* Status da sincronização */}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            {!error && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-400 opacity-40" />
            )}

            <span
              className={`relative size-2 rounded-full ${
                error
                  ? "bg-amber-400"
                  : "bg-lime-400"
              }`}
            />
          </span>

          <span className="text-[11px] text-muted-foreground">
            {error
              ? "Exibindo últimos dados recebidos"
              : "Monitoramento ao vivo"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">
            Atualizado às{" "}
            {new Date(data.updatedAt).toLocaleTimeString(
              "pt-BR",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }
            )}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 rounded-lg"
            onClick={() => void mutate()}
            disabled={isValidating}
            aria-label="Atualizar estatísticas"
          >
            <RefreshCw
              className={`size-3.5 text-muted-foreground ${
                isValidating ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Cards */}

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon
          const status = item.status ?? "neutral"

          return (
            <Card
              key={item.id}
              className="
                group relative gap-0 overflow-hidden
                rounded-2xl border border-border/60
                bg-card/60 py-0 shadow-none
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-lime-400/20
                hover:bg-card
                hover:shadow-lg hover:shadow-black/5
              "
            >
              <CardHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-0">
                <span className="text-xs font-medium tracking-wide text-muted-foreground">
                  {item.name}
                </span>

                <div
                  className="
                    flex size-9 items-center justify-center
                    rounded-xl border border-border/50
                    bg-muted/40 text-muted-foreground
                    transition-all duration-300
                    group-hover:border-lime-400/20
                    group-hover:bg-lime-400/10
                    group-hover:text-lime-400
                  "
                >
                  <Icon
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </div>
              </CardHeader>

              <CardContent className="px-5 pt-4 pb-5">
                <div className="flex items-end justify-between gap-3">
                  <h2
                    className="
                      text-3xl font-semibold
                      tracking-tight text-foreground
                      tabular-nums sm:text-4xl
                    "
                  >
                    {item.value}
                  </h2>

                  {status === "offline" && (
                    <span className="rounded-md bg-red-500/10 px-2 py-1 text-[10px] font-medium text-red-400">
                      Offline
                    </span>
                  )}

                  {status === "warning" && (
                    <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-400">
                      Atenção
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-4">
                  {status !== "neutral" ? (
                    <span className="relative flex size-2 shrink-0">
                      {status === "online" && (
                        <span
                          className={`
                            absolute inline-flex size-full
                            animate-ping rounded-full opacity-30
                            ${statusColors[status]}
                          `}
                        />
                      )}

                      <span
                        className={`
                          relative inline-flex size-2
                          rounded-full
                          ${statusColors[status]}
                        `}
                      />
                    </span>
                  ) : (
                    <Activity className="size-3.5 shrink-0 text-muted-foreground/60" />
                  )}

                  <p className="truncate text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="gap-0 rounded-2xl border-border/60 bg-card/60 py-0 shadow-none"
          >
            <CardHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-0">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="size-9 rounded-xl" />
            </CardHeader>

            <CardContent className="px-5 pt-4 pb-5">
              <Skeleton className="h-10 w-20" />

              <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-4">
                <Skeleton className="size-2 rounded-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}