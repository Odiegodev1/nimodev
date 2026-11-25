"use client"
import { useMemo, useState } from "react"

import {
  ArrowUpRight,
  CircleAlert,
  Globe2,
  LaptopMinimal,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Wifi,
  RefreshCw,
  Share2,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShareSiteDialog } from "./shardesite"
export type ProjectStatus = "online" | "offline" | "demo"
export interface Project {
  id: string
  name: string
  url: string
  status: ProjectStatus
  device?: string | null
  httpStatus?: number | null
  responseTime?: number | null
  visitorsOnline?: number | null
  lastCheckedAt?: string | null
}
interface ProjectsTableProps {
  initialData: Project[]
  onAddProject?: () => void
  onDeleteProject?: (project: Project) => Promise<void>
  onRefresh?: () => Promise<void> | void
}
const statusConfig = {
  online: {
    label: "Online",
    dot: "bg-lime-400",
    text: "text-lime-400",
    background: "bg-lime-400/10",
    border: "border-lime-400/15",
  },
  offline: {
    label: "Offline",
    dot: "bg-red-400",
    text: "text-red-400",
    background: "bg-red-400/10",
    border: "border-red-400/15",
  },
  demo: {
    label: "Não verificado",
    dot: "bg-zinc-400",
    text: "text-zinc-400",
    background: "bg-zinc-400/10",
    border: "border-zinc-400/15",
  },
} satisfies Record<
  ProjectStatus,
  {
    label: string
    dot: string
    text: string
    background: string
    border: string
  }
>
export function ProjectsTable({
initialData,
onAddProject,
onDeleteProject,
onRefresh,
}: ProjectsTableProps) {
  const [search, setSearch] = useState("")
  const [projectToShare, setProjectToShare] = useState<Project | null>(null)
  const [projectToDelete, setProjectToDelete] =
    useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
// Os dados vêm da API por meio do componente pai.
  const projects = initialData
  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return projects
    return projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(query) ||
        project.url.toLowerCase().includes(query) ||
        (project.device ?? "").toLowerCase().includes(query)
      )
    })
  }, [projects, search])
  const stats = useMemo(() => {
    return {
      total: projects.length,
      online: projects.filter((p) => p.status === "online").length,
      offline: projects.filter((p) => p.status === "offline").length,
      pending: projects.filter((p) => p.status === "demo").length,
    }
  }, [projects])
  async function handleDelete() {
    if (!projectToDelete || isDeleting) return
    if (!onDeleteProject) {
      setDeleteError("A exclusão não está configurada.")
      return
    }
    setIsDeleting(true)
    setDeleteError(null)
    try {
      console.log("[NIMO] Solicitando exclusão:", {
        id: projectToDelete.id,
        name: projectToDelete.name,
      })
      await onDeleteProject(projectToDelete)
      console.log("[NIMO] Projeto excluído:", projectToDelete.id)
      setProjectToDelete(null)
    } catch (error) {
      console.error("[NIMO] Erro ao excluir projeto:", error)
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o projeto."
      )
    } finally {
      setIsDeleting(false)
    }
  }
  async function handleRefresh() {
    if (!onRefresh || isRefreshing) return
    setIsRefreshing(true)
    try {
      await onRefresh()
      console.log("[NIMO] Lista de projetos atualizada.")
    } catch (error) {
      console.error("[NIMO] Erro ao atualizar projetos:", error)
    } finally {
      setIsRefreshing(false)
    }
  }
  return (
    <>
      <Card
className="
          gap-0 overflow-hidden rounded-2xl
          border border-border/60
          bg-card/60 py-0 shadow-none
          transition-colors duration-300
          hover:border-lime-400/20
        "
      >
        {/* HEADER */}
        <CardHeader className="space-y-5 px-5 pt-5 pb-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
                  <Globe2
className="size-4 text-lime-400"
strokeWidth={1.8}
                  />
                </div>
                <CardTitle className="text-sm font-semibold tracking-tight">
                  Seus projetos
                </CardTitle>
                <Badge
variant="secondary"
className="ml-1 rounded-md px-2 text-[10px]"
                >
                  {stats.total}
                </Badge>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Gerencie seus sites e dispositivos conectados ao NIMO.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
                <span className="size-1.5 rounded-full bg-lime-400" />
                <span className="text-[11px] text-muted-foreground">
                  {stats.online} online
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
                <span className="size-1.5 rounded-full bg-red-400" />
                <span className="text-[11px] text-muted-foreground">
                  {stats.offline} offline
                </span>
              </div>
              {onRefresh && (
                <Button
type="button"
variant="outline"
size="icon"
disabled={isRefreshing}
onClick={() => void handleRefresh()}
className="size-9 rounded-lg border-border/60"
aria-label="Atualizar lista de projetos"
                >
                  <RefreshCw
className={`size-4 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                </Button>
              )}
            </div>
          </div>
          {/* BUSCA */}
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
value={search}
onChange={(event) => setSearch(event.target.value)}
placeholder="Buscar projetos..."
className="
                  h-10 rounded-xl
                  border-border/60 bg-muted/20
                  pl-9 text-xs shadow-none
                  focus-visible:border-lime-400/30
                  focus-visible:ring-lime-400/10
                "
              />
            </div>
            {onAddProject && (
              <Button
type="button"
onClick={onAddProject}
className="
                  h-10 gap-2 rounded-xl
                  bg-lime-400 px-4
                  text-xs font-semibold text-black
                  hover:bg-lime-300
                "
              >
                <Plus className="size-4" />
                Novo projeto
              </Button>
            )}
          </div>
        </CardHeader>
        {/* TABELA */}
        <CardContent className="px-0 pb-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="border-border/60 bg-muted/20 hover:bg-muted/20">
                  <TableHead className="h-11 pl-5 text-[11px] font-medium text-muted-foreground">
                    Projeto
                  </TableHead>
                  <TableHead className="text-[11px] font-medium text-muted-foreground">
                    Endereço
                  </TableHead>
                  <TableHead className="text-[11px] font-medium text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-[11px] font-medium text-muted-foreground">
                    Dispositivo
                  </TableHead>
                  <TableHead className="pr-5 text-right text-[11px] font-medium text-muted-foreground">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 text-center">
                        <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
                          <Globe2 className="size-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {projects.length === 0
                              ? "Nenhum site cadastrado"
                              : "Nenhum projeto encontrado"}
                          </p>
                          <p className="max-w-xs text-xs leading-6 text-muted-foreground">
                            {projects.length === 0
                              ? "Cadastre seu primeiro site para começar a monitorar seus projetos com o NIMO."
                              : "Tente buscar por outro nome ou endereço."}
                          </p>
                        </div>
                        {projects.length === 0 && onAddProject && (
                          <Button
type="button"
onClick={onAddProject}
className="mt-2 gap-2 rounded-xl bg-lime-400 text-black hover:bg-lime-300"
                          >
                            <Plus className="size-4" />
                            Adicionar primeiro site
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => {
                    const status = statusConfig[project.status]
                    return (
                      <TableRow
key={project.id}
className="
                          group/row border-border/50
                          transition-colors hover:bg-muted/20
                        "
                      >
                        {/* PROJETO */}
                        <TableCell className="py-4 pl-5">
                          <div className="flex items-center gap-3">
                            <div
className="
                                flex size-9 shrink-0
                                items-center justify-center
                                rounded-xl border border-border/60
                                bg-muted/40 text-muted-foreground
                                transition-colors
                                group-hover/row:border-lime-400/20
                                group-hover/row:text-lime-400
                              "
                            >
                              <Globe2 className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-40 truncate text-xs font-semibold text-foreground sm:text-sm">
                                {project.name}
                              </p>
                              <span className="text-[10px] text-muted-foreground">
                                ID: {project.id.slice(0, 12)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        {/* URL */}
                        <TableCell>
                          <a
href={project.url}
target="_blank"
rel="noopener noreferrer"
className="
                              group/link flex max-w-[260px]
                              items-center gap-1.5
                              text-xs text-muted-foreground
                              transition-colors hover:text-lime-400
                            "
                          >
                            <span className="truncate">
                              {project.url}
                            </span>
                            <ArrowUpRight
className="
                                size-3.5 shrink-0 opacity-0
                                transition-opacity
                                group-hover/link:opacity-100
                              "
                            />
                          </a>
                        </TableCell>
                        {/* STATUS */}
                        <TableCell>
                          <div className="flex flex-col items-start gap-1.5">
                            <span
className={`
                                inline-flex items-center gap-1.5
                                rounded-md border px-2.5 py-1
                                text-[11px] font-medium
                                ${status.background}
                                ${status.border}
                                ${status.text}
                              `}
                            >
                              <span
className={`size-1.5 rounded-full ${status.dot}`}
                              />
                              {status.label}
                            </span>
                            {project.responseTime != null && (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {project.responseTime}ms
                                {project.httpStatus != null
                                  ? ` · HTTP ${project.httpStatus}`
                                  : ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        {/* DISPOSITIVO */}
                        <TableCell>
                          {project.device ? (
                            <div className="flex items-center gap-2">
                              <LaptopMinimal className="size-3.5 text-lime-400" />
                              <span className="max-w-32 truncate text-xs text-muted-foreground">
                                {project.device}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/60">
                              Não vinculado
                            </span>
                          )}
                        </TableCell>
                        {/* AÇÕES */}
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
render={
                                <Button
variant="ghost"
size="icon"
className="
                                    size-8 rounded-lg
                                    text-muted-foreground
                                    hover:bg-muted
                                    hover:text-foreground
                                  "
aria-label={`Ações do projeto ${project.name}`}
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              }
                            />
                            <DropdownMenuContent
align="end"
className="w-48 rounded-xl"
                            >
                              <DropdownMenuItem
render={
                                  <a
href={project.url}
target="_blank"
rel="noopener noreferrer"
className="gap-2 text-xs"
                                  >
                                    <ArrowUpRight className="size-4" />
                                    Abrir projeto
                                  </a>
                                }
                              />
                              <DropdownMenuItem onClick={() => setProjectToShare(project)} className="gap-2 text-xs">
                                <Share2 className="size-4 text-lime-400" />
                                Compartilhar site
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
disabled={!onDeleteProject}
onSelect={() => {
                                  setDeleteError(null)
                                  setProjectToDelete(project)
                                }}
className="gap-2 text-xs text-red-400 focus:text-red-400"
                              >
                                <Trash2 className="size-4" />
                                Excluir projeto
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {/* RODAPÉ */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4">
          <p className="text-[11px] text-muted-foreground">
            Exibindo{" "}
            <span className="font-medium text-foreground">
              {filteredProjects.length}
            </span>{" "}
            de{" "}
            <span className="font-medium text-foreground">
              {projects.length}
            </span>{" "}
            projetos
          </p>
          <div className="flex items-center gap-1.5">
            <Wifi className="size-3.5 text-lime-400" />
            <span className="text-[11px] text-muted-foreground">
              Painel NIMO
            </span>
          </div>
        </div>
      </Card>
      <ShareSiteDialog project={projectToShare} onClose={() => setProjectToShare(null)} />
      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      <AlertDialog
open={!!projectToDelete}
onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setProjectToDelete(null)
            setDeleteError(null)
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl border-border/60">
          <AlertDialogHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/10">
              <CircleAlert className="size-5 text-red-400" />
            </div>
            <AlertDialogTitle>
              Excluir projeto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir{" "}
              <span className="font-semibold text-foreground">
                {projectToDelete?.name}
              </span>
              ?
              <br />
              <br />
              Esta ação removerá o projeto do banco de dados.
              Não será possível desfazê-la.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p
role="alert"
className="rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-400"
            >
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
disabled={isDeleting}
className="rounded-lg"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
onClick={(event) => {
event.preventDefault()
                void handleDelete()
              }}
disabled={isDeleting || !onDeleteProject}
className="rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="mr-2 size-4" />
              {isDeleting ? "Excluindo..." : "Excluir projeto"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}