"use client"

import {
  Check,
  ChevronRight,
  CircleUserRound,
  Loader2,
  LogOut,
  Palette,
  Shield,
  Trash2,
  AlertTriangle,
  Mail,
  Monitor,
  Settings2,
} from "lucide-react"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { NimoPreview } from "./NimoPreview"

import {
  updateProfile,
  updateNimoTheme,
  logoutAction,
  deleteAccount,
} from "../actions"

const themes = [
  {
    id: "ORIGINAL",
    name: "Original",
    color: "#B8F36B",
  },
  {
    id: "OCEAN",
    name: "Ocean",
    color: "#60A5FA",
  },
  {
    id: "LAVENDER",
    name: "Lavender",
    color: "#C084FC",
  },
  {
    id: "SUNSET",
    name: "Sunset",
    color: "#FB923C",
  },
  {
    id: "ROSE",
    name: "Rose",
    color: "#F472B6",
  },
  {
    id: "ICE",
    name: "Ice",
    color: "#E8ECF0",
  },
] as const

type Theme = (typeof themes)[number]["id"]

interface SettingsContentProps {
  user: {
    name: string | null
    email: string | null
    image: string | null
    nimoTheme: Theme
  }

  totalDevices: number
}

export function SettingsContent({
  user,
  totalDevices,
}: SettingsContentProps) {
  const [name, setName] = useState(user.name ?? "")
  const [savedName, setSavedName] = useState(
    user.name ?? ""
  )

  const [theme, setTheme] = useState<Theme>(
    user.nimoTheme
  )

  const [savedTheme, setSavedTheme] = useState<Theme>(
    user.nimoTheme
  )

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmation, setConfirmation] = useState("")

  const [profilePending, startProfileTransition] =
    useTransition()

  const [themePending, startThemeTransition] =
    useTransition()

  const [deletePending, startDeleteTransition] =
    useTransition()

  const currentTheme =
    themes.find((item) => item.id === theme) ??
    themes[0]

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("") || "N"

  function handleSaveProfile() {
    startProfileTransition(async () => {
      try {
        const result = await updateProfile(name)

        if (!result.success) {
          toast.error(result.error)
          return
        }

        setSavedName(name.trim())
        setName(name.trim())

        toast.success("Perfil atualizado.")
      } catch {
        toast.error("Não foi possível atualizar o perfil.")
      }
    })
  }

  function handleSaveTheme() {
    const selectedTheme = theme

    startThemeTransition(async () => {
      try {
        const result =
          await updateNimoTheme(selectedTheme)

        if (!result.success) {
          toast.error(result.error)
          return
        }

        setSavedTheme(selectedTheme)

        toast.success("Personalização salva.")
      } catch {
        toast.error("Não foi possível salvar a cor.")
      }
    })
  }

  function handleDeleteAccount() {
    startDeleteTransition(async () => {
      // O redirecionamento é realizado pela Server Action.
      const result = await deleteAccount(confirmation)

      if (result && !result.success) {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">

      {/* Cabeçalho */}

      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Dashboard

          <ChevronRight className="size-3" />

          <span className="text-foreground">
            Configurações
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border border-border/60 bg-card">
            <Settings2 className="size-5 text-lime-400" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Configurações
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Seu espaço. Seu perfil. Seu NIMO.
            </p>
          </div>
        </div>
      </header>

      {/* Minha conta */}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CircleUserRound className="size-4 text-muted-foreground" />

          <h2 className="text-sm font-semibold">
            Minha conta
          </h2>
        </div>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/60 shadow-none">
          <CardHeader className="border-b border-border/50 pb-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border border-border">
                <AvatarImage src={user.image ?? undefined} />

                <AvatarFallback className="bg-lime-400/10 text-lg text-lime-400">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 space-y-1">
                <CardTitle className="truncate text-base">
                  {savedName || "Minha conta"}
                </CardTitle>

                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>

                <Badge
                  variant="outline"
                  className="border-lime-400/20 bg-lime-400/5 text-[10px] text-lime-400"
                >
                  Conta NIMO Dev
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome completo</Label>

                <Input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  maxLength={80}
                  placeholder="Seu nome"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>E-mail</Label>

                <div className="relative">
                  <Mail className="absolute top-3.5 left-3 size-4 text-muted-foreground" />

                  <Input
                    value={user.email ?? ""}
                    readOnly
                    className="h-11 rounded-xl bg-muted/20 pl-10 text-muted-foreground"
                  />
                </div>

                <p className="text-[11px] text-muted-foreground">
                  E-mail associado à sua autenticação.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-border/50 pt-5">
              <Button
                onClick={handleSaveProfile}
                disabled={
                  profilePending ||
                  name.trim() === savedName ||
                  name.trim().length < 2
                }
                className="rounded-xl bg-lime-400 text-black hover:bg-lime-300"
              >
                {profilePending && (
                  <Loader2 className="size-4 animate-spin" />
                )}

                Salvar alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Personalização */}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="size-4 text-muted-foreground" />

          <h2 className="text-sm font-semibold">
            Meu NIMO
          </h2>
        </div>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/60 shadow-none">
          <CardHeader className="pb-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1.5">
                <CardTitle className="text-base">
                  Personalize seu companheiro
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  Dê ao seu NIMO uma personalidade única.
                </p>
              </div>

              <Badge variant="outline">
                <Monitor className="mr-1 size-3" />

                {totalDevices}{" "}
                {totalDevices === 1
                  ? "dispositivo"
                  : "dispositivos"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-8 lg:grid-cols-2">

              {/* Personagem animado */}

              <NimoPreview color={currentTheme.color} />

              {/* Seletor de cores */}

              <div className="flex flex-col justify-center space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">
                    Cor do personagem
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    Escolha a cor dos olhos, antena e sorriso.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {themes.map((item) => {
                    const selected = theme === item.id

                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setTheme(item.id)}
                        className={`
                          relative flex flex-col items-center
                          gap-3 rounded-xl border p-4
                          transition-all duration-300
                          hover:-translate-y-0.5
                          ${
                            selected
                              ? "border-lime-400/40 bg-lime-400/5"
                              : "border-border/60 bg-muted/20 hover:border-border"
                          }
                        `}
                      >
                        {selected && (
                          <Check className="absolute top-2 right-2 size-3.5 text-lime-400" />
                        )}

                        <div
                          className="size-9 rounded-full"
                          style={{
                            backgroundColor: item.color,
                            boxShadow: selected
                              ? `0 0 20px ${item.color}30`
                              : undefined,
                          }}
                        />

                        <span className="text-xs font-medium">
                          {item.name}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full"
                      style={{
                        backgroundColor: currentTheme.color,
                      }}
                    />

                    <span className="text-xs">
                      {currentTheme.name}
                    </span>
                  </div>

                  <span className="font-mono text-xs text-muted-foreground">
                    {currentTheme.color}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setTheme("ORIGINAL")}
                  className="self-start px-0 text-xs text-muted-foreground"
                >
                  Restaurar cor original
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
              <p className="text-xs text-muted-foreground">
                A personalização será salva na sua conta.
              </p>

              <Button
                onClick={handleSaveTheme}
                disabled={
                  themePending || theme === savedTheme
                }
                className="rounded-xl bg-lime-400 text-black hover:bg-lime-300"
              >
                {themePending && (
                  <Loader2 className="size-4 animate-spin" />
                )}

                Salvar personalização
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Segurança */}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-muted-foreground" />

          <h2 className="text-sm font-semibold">
            Segurança e conta
          </h2>
        </div>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/60 py-0 shadow-none">
          <CardContent className="divide-y divide-border/50 px-5">

            {/* Logout */}

            <div className="flex flex-wrap items-center justify-between gap-4 py-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
                  <LogOut className="size-4 text-muted-foreground" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium">
                    Sair da conta
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    Encerre sua sessão neste navegador.
                  </p>
                </div>
              </div>

              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-xl"
                >
                  <LogOut className="size-4" />

                  Sair
                </Button>
              </form>
            </div>

            {/* Exclusão */}

            <div className="flex flex-wrap items-center justify-between gap-4 py-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10">
                  <Trash2 className="size-4 text-red-400" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-red-400">
                    Excluir conta
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    Remova permanentemente sua conta e seus dados.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setDeleteOpen(true)}
                className="rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                Excluir conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Rodapé */}

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-6">
        <div className="text-sm font-semibold tracking-tight">
          nimo
          <span className="font-normal text-muted-foreground">
            /dev
          </span>
        </div>

        <span className="text-xs text-muted-foreground">
          Seus projetos ganharam vida.
        </span>

        <span className="font-mono text-[10px] text-muted-foreground">
          v1.0.0
        </span>
      </footer>

      {/* Modal de exclusão */}

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (deletePending) return

          setDeleteOpen(open)

          if (!open) {
            setConfirmation("")
          }
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
              <AlertTriangle className="size-6 text-red-400" />
            </div>

            <DialogTitle>
              Excluir sua conta?
            </DialogTitle>

            <DialogDescription>
              Esta ação é permanente e não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-3">
            <div className="space-y-2 rounded-xl border border-red-500/15 bg-red-500/5 p-4 text-xs leading-relaxed text-muted-foreground">
              <p className="font-medium text-red-400">
                Os seguintes dados serão removidos:
              </p>

              <p>• Sua conta e preferências.</p>
              <p>• Todos os sites cadastrados.</p>
              <p>• Dispositivos vinculados.</p>
              <p>• Histórico de alertas.</p>
            </div>

            <div className="space-y-2">
              <Label>
                Digite EXCLUIR para confirmar.
              </Label>

              <Input
                value={confirmation}
                onChange={(event) =>
                  setConfirmation(event.target.value)
                }
                placeholder="EXCLUIR"
                autoComplete="off"
                disabled={deletePending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={deletePending}
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </Button>

            <Button
              variant="destructive"
              disabled={
                confirmation !== "EXCLUIR" ||
                deletePending
              }
              onClick={handleDeleteAccount}
            >
              {deletePending && (
                <Loader2 className="size-4 animate-spin" />
              )}

              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}