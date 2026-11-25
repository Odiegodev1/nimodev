import Link from "next/link"

import {
  Activity,
  ArrowRight,
  Check,
  Monitor,
  Radio,
  Globe,
  AlertTriangle,
  WifiOff,
  FileWarning,
  type LucideIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { buttonVariants } from "@/components/ui/button"

import { auth } from "@/lib/auth"

import { connection } from "next/server"

import { redirect } from "next/navigation"
import { ActivityIcon, ActivityType, getRecentActivity } from "@/lib/get-recent-activity"
import { formatRelativeTime } from "@/lib/relative-time"


const activityIcons: Record<ActivityIcon, LucideIcon> = {
  check: Check,
  globe: Globe,
  monitor: Monitor,
  radio: Radio,
  alert: AlertTriangle,
  offline: WifiOff,
  file: FileWarning,
}

const activityStyles: Record<
  ActivityType,
  {
    icon: string
    background: string
    border: string
  }
> = {
  success: {
    icon: "text-lime-400",
    background: "bg-lime-400/10",
    border: "border-lime-400/15",
  },

  info: {
    icon: "text-blue-400",
    background: "bg-blue-400/10",
    border: "border-blue-400/15",
  },

  device: {
    icon: "text-violet-400",
    background: "bg-violet-400/10",
    border: "border-violet-400/15",
  },

  system: {
    icon: "text-zinc-400",
    background: "bg-zinc-400/10",
    border: "border-zinc-400/15",
  },

  warning: {
    icon: "text-amber-400",
    background: "bg-amber-400/10",
    border: "border-amber-400/15",
  },

  error: {
    icon: "text-red-400",
    background: "bg-red-400/10",
    border: "border-red-400/15",
  },
}

interface RecentActivityProps {
  className?: string
  limit?: number
}

export async function RecentActivity({
  className = "",
  limit = 6,
}: RecentActivityProps) {
  await connection()

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const items = await getRecentActivity(
    session.user.id,
    limit
  )

  return (
    <Card
      className={`
        h-fit w-full xl:w-2/5
        group relative gap-0 overflow-hidden
        rounded-2xl border border-border/60
        bg-card/60 py-0 shadow-none
        transition-all duration-300
        hover:border-lime-400/20
        hover:bg-card
        ${className}
      `}
    >
      {/* HEADER */}

      <CardHeader className="px-5 pt-5 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="
                  flex size-8 items-center justify-center
                  rounded-lg border border-border/60
                  bg-muted/40
                "
              >
                <Activity
                  className="size-4 text-lime-400"
                  strokeWidth={1.8}
                />
              </div>

              <CardTitle className="text-sm font-semibold tracking-tight">
                Atividade recente
              </CardTitle>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Eventos importantes dos seus sites e dispositivos.
            </p>
          </div>

          <span
            className="
              flex shrink-0 items-center gap-1.5
              rounded-md border border-border/60
              bg-muted/40 px-2.5 py-1
              text-[11px] font-medium
              text-muted-foreground
            "
          >
            <span className="size-1.5 rounded-full bg-lime-400" />

            Recentes
          </span>
        </div>
      </CardHeader>

      {/* LISTA DE ATIVIDADES */}

      <CardContent className="px-5 pb-2">
        {items.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
              <Activity
                className="size-5 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">
                Nenhuma atividade recente
              </h3>

              <p className="max-w-60 text-xs leading-relaxed text-muted-foreground">
                Os eventos dos seus sites e dispositivos
                aparecerão aqui automaticamente.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* LINHA DA TIMELINE */}

            {items.length > 1 && (
              <div className="absolute top-5 bottom-7 left-[19px] w-px bg-border/60" />
            )}

            <div className="space-y-1">
              {items.map((item) => {
                const Icon = activityIcons[item.icon]

                const style = activityStyles[item.type]

                return (
                  <div
                    key={item.id}
                    className="
                      group/item relative flex items-start
                      gap-3 rounded-xl px-0 py-3
                      transition-colors duration-200
                    "
                  >
                    {/* ÍCONE */}

                    <div
                      className={`
                        relative z-10 flex size-10
                        shrink-0 items-center justify-center
                        rounded-xl border
                        transition-transform duration-300
                        group-hover/item:scale-105
                        ${style.background}
                        ${style.border}
                      `}
                    >
                      <Icon
                        className={`size-4 ${style.icon}`}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* CONTEÚDO */}

                    <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
                      <h4
                        className="
                          text-xs font-semibold
                          leading-relaxed text-foreground
                          sm:text-sm
                        "
                      >
                        {item.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="break-all text-xs text-muted-foreground">
                          {item.description}
                        </span>

                        <span className="size-0.5 rounded-full bg-muted-foreground/40" />

                        <time
                          dateTime={item.date.toISOString()}
                          title={item.date.toLocaleString("pt-BR", {
                            timeZone: "America/Sao_Paulo",
                          })}
                          className="text-[11px] text-muted-foreground/70"
                        >
                          {formatRelativeTime(item.date)}
                        </time>
                      </div>
                    </div>

                    {/* INDICADOR CRÍTICO */}

                    {item.type === "error" && (
                      <span className="relative mt-2 flex size-2 shrink-0">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-40" />

                        <span className="relative inline-flex size-2 rounded-full bg-red-400" />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>

      {/* FOOTER */}

      <div className="px-5 pt-3 pb-5">
        <Link
          href="/alerta"
          className={buttonVariants({
            variant: "outline",
            className: `
              group/button h-10 w-full
              justify-between rounded-xl
              border-border/60 bg-muted/20
              text-xs font-medium
              text-muted-foreground
              shadow-none
              transition-all duration-200
              hover:border-lime-400/20
              hover:bg-lime-400/5
              hover:text-lime-400
            `,
          })}
        >
          <span>Ver todos os alertas</span>

          <ArrowRight
            className="
              size-4 transition-transform duration-200
              group-hover/button:translate-x-1
            "
          />
        </Link>
      </div>
    </Card>
  )
}