"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  type Project,
  ProjectsTable,
} from "./ProjectsTable"

import { CreateSiteDialog } from "./CreateSiteDialog"

interface ApiSite {
  id: string
  name: string
  url: string
  status: "UNKNOWN" | "ONLINE" | "OFFLINE"
  httpStatus: number | null
  responseTime: number | null
  visitorsOnline: number | null
  lastCheckedAt: string | null
}

function mapSite(site: ApiSite): Project {
  return {
    id: site.id,
    name: site.name,
    url: site.url,
    status:
      site.status === "ONLINE"
        ? "online"
        : site.status === "OFFLINE"
          ? "offline"
          : "demo",
    httpStatus: site.httpStatus,
    responseTime: site.responseTime,
    visitorsOnline: site.visitorsOnline,
    lastCheckedAt: site.lastCheckedAt,
    device: null,
  }
}

export function SitesContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  const loadSites = useCallback(async () => {
    const response = await fetch("/api/sites", {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Não foi possível carregar os sites.")
    }

    const data: { sites: ApiSite[] } = await response.json()

    setProjects(data.sites.map(mapSite))

    console.log("[NIMO] Sites carregados:", data.sites.length)

    return data.sites
  }, [])

  const checkSites = useCallback(async (sites: ApiSite[]) => {
    if (sites.length === 0) return

    setChecking(true)

    try {
      // Verifica sequencialmente para não disparar muitas
      // requisições simultâneas à API externa.
      for (const site of sites) {
        try {
          const response = await fetch(
            `/api/sites/${encodeURIComponent(site.id)}/check`,
            {
              method: "POST",
            }
          )

          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.error ?? "Falha na verificação.")
          }

          setProjects((current) =>
            current.map((project) =>
              project.id === site.id
                ? mapSite(result.site as ApiSite)
                : project
            )
          )
        } catch (error) {
          console.error(
            `[NIMO] Erro ao verificar ${site.name}:`,
            error
          )
        }
      }
    } finally {
      setChecking(false)
    }
  }, [])

  const refreshAll = useCallback(async () => {
    const sites = await loadSites()
    await checkSites(sites)
  }, [loadSites, checkSites])

  useEffect(() => {
    let cancelled = false

    async function initialize() {
      try {
        const sites = await loadSites()

        if (!cancelled) {
          setLoading(false)
          await checkSites(sites)
        }
      } catch (error) {
        console.error("[NIMO] Erro ao iniciar:", error)

        if (!cancelled) {
          toast.error("Não foi possível carregar os sites.")
          setLoading(false)
        }
      }
    }

    void initialize()

    return () => {
      cancelled = true
    }
  }, [loadSites, checkSites])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return

      void refreshAll().catch((error) => {
        console.error("[NIMO] Atualização automática:", error)
      })
    }, 60_000)

    return () => window.clearInterval(interval)
  }, [refreshAll])

  async function handleDelete(project: Project) {
    const response = await fetch(
      `/api/sites/${encodeURIComponent(project.id)}`,
      {
        method: "DELETE",
      }
    )

    if (!response.ok) {
      const result = await response.json().catch(() => ({}))

      throw new Error(result.error ?? "Erro ao excluir site.")
    }

    toast.success("Site excluído com sucesso.")

    await loadSites()
  }

  async function handleCreated() {
    try {
      await refreshAll()
    } catch (error) {
      console.error("[NIMO] Erro após cadastro:", error)
      toast.error("Site salvo, mas não foi possível atualizar a lista.")
    }
  }

  async function handleManualRefresh() {
    if (checking) return

    try {
      await refreshAll()
      toast.success("Monitoramento atualizado.")
    } catch (error) {
      console.error("[NIMO] Erro ao atualizar:", error)
      toast.error("Não foi possível atualizar os sites.")
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <p className="font-mono text-xs font-semibold tracking-wider text-lime-400">
            MONITORAMENTO
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Meus sites
          </h1>

          <p className="max-w-lg text-sm leading-6 text-muted-foreground">
            Monitore a disponibilidade e o desempenho dos seus
            projetos em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => void handleManualRefresh()}
            disabled={checking || loading}
            className="h-10 gap-2 rounded-xl"
          >
            {checking ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}

            {checking ? "Verificando..." : "Verificar agora"}
          </Button>

          <CreateSiteDialog onCreated={handleCreated} />
        </div>
      </header>

      <main className="mt-8 flex-1">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-lime-400" />
          </div>
        ) : (
          <ProjectsTable
            initialData={projects}
            onDeleteProject={handleDelete}
          />
        )}
      </main>
    </div>
  )
}