"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Globe2, Loader2, Plus, ArrowRight } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  createSiteSchema,
  type CreateSiteInput,
} from "@/lib/validations/site.schema"

interface CreateSiteDialogProps {
  onCreated: () => void | Promise<void>
}

export function CreateSiteDialog({
  onCreated,
}: CreateSiteDialogProps) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSiteInput>({
    resolver: zodResolver(createSiteSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  })

  async function onSubmit(data: CreateSiteInput) {
    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? "Erro ao cadastrar site.")
      }

      console.log("[NIMO] Site cadastrado:", result.site)

      toast.success("Site cadastrado com sucesso!")

      reset()
      setOpen(false)

      await onCreated()
    } catch (error) {
      console.error("[NIMO] Erro no cadastro:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o site."
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="h-10 gap-2 rounded-xl bg-lime-400 px-4 font-semibold text-black hover:bg-lime-300">
            <Plus className="size-4" />
            Novo site
          </Button>
        }
      />

      <DialogContent className="max-w-md rounded-2xl border-white/10 bg-[#111411] p-0 text-white sm:max-w-[460px]">
        <div className="p-6 sm:p-7">
          <DialogHeader className="text-left">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-lime-400/15 bg-lime-400/10">
              <Globe2 className="size-5 text-lime-400" />
            </div>

            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Adicionar site
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-zinc-400">
              Cadastre um projeto para acompanhar sua disponibilidade
              e futuramente exibir seus dados no NIMO.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-7 space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="site-name">
                Nome do projeto
              </Label>

              <Input
                id="site-name"
                placeholder="Ex.: Meu Portfólio"
                className="h-11 rounded-xl border-white/10 bg-white/[0.03]"
                {...register("name")}
              />

              {errors.name && (
                <p className="text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-url">
                Endereço do site
              </Label>

              <Input
                id="site-url"
                type="url"
                placeholder="https://meusite.com.br"
                className="h-11 rounded-xl border-white/10 bg-white/[0.03]"
                {...register("url")}
              />

              {errors.url && (
                <p className="text-xs text-red-400">
                  {errors.url.message}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-lime-400/10 bg-lime-400/[0.04] p-4">
              <p className="text-xs leading-6 text-zinc-400">
                O NIMO poderá acompanhar o status HTTP e o tempo
                de resposta desse endereço.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 rounded-xl bg-lime-400 font-semibold text-black hover:bg-lime-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    Cadastrar site
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}