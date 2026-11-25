"use client"

import Link from "next/link"
import { ArrowRight, Cpu, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import { NimoDevice } from "@/components/NimoDevice"

interface NimoSetupBannerProps {
  onStartSetup?: () => void
}

export function NimoSetupBanner({
  onStartSetup,
}: NimoSetupBannerProps) {
  return (
    <section
      className="
        relative isolate w-full overflow-hidden
        rounded-2xl border border-border/60
        bg-[#101310]
       
      "
    >
      {/* Iluminação de fundo */}
      <div className="pointer-events-none absolute -right-20 top-1/2 size-[400px] -translate-y-1/2 rounded-full bg-lime-400/[0.06] blur-[100px]" />

      {/* Detalhe decorativo */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(184,243,107,0.035),transparent_50%)]" />

      <div
        className="
          relative flex items-center justify-between px-10
        "
      >
        {/* CONTEÚDO ESQUERDO */}
        <div className="relative z-10 flex flex-col items-start">
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md border border-lime-400/15 bg-lime-400/10">
              <Cpu className="size-3.5 text-lime-400" />
            </span>

            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-lime-400">
              NIMO /dev
            </span>

            <span className="text-zinc-600">·</span>

            <span className="font-mono text-[10px] tracking-wider text-zinc-500">
              ESP32
            </span>
          </div>

          {/* Título */}
          <h2
            className="
              max-w-xl text-3xl font-semibold
              leading-[1.12] tracking-[-0.045em]
              text-white
              sm:text-4xl
              xl:text-[46px]
            "
          >
            Uma telinha.
            <br />

            <span className="text-lime-400">
              Infinitas conexões.
            </span>
          </h2>

          {/* Descrição */}
          <p
            className="
              mt-5 max-w-[440px]
              text-sm leading-7
              text-zinc-400
            "
          >
            Leve o NIMO para qualquer lugar.
            Configure uma nova rede Wi-Fi, vincule à sua conta
            e escolha qual site deseja acompanhar.
          </p>

          {/* Botões */}
          <div className="mt-7 flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <Button
             
             
              className="
                group h-10 gap-2 rounded-lg
                bg-lime-400 px-4
                text-xs font-semibold text-black
                shadow-none
                hover:bg-lime-300
                cursor-pointer
              "
            >
              Começar configuração

              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              
              variant="outline"
              className="
                h-10 rounded-lg
                border-white/10
                bg-white/[0.03]
                px-4 text-xs
                text-zinc-300
                shadow-none
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              <Link href="/dashboard/devices">
                Meus dispositivos
              </Link>
            </Button>
          </div>
        </div>

        {/* NIMO À DIREITA */}
        <div
          className="
            relative flex min-h-[260px]
            items-center justify-center
            lg:min-h-[300px]
          "
        >
          {/* Glow atrás do personagem */}
          <div
            className="
              pointer-events-none absolute
              left-1/2 top-1/2
              size-52 -translate-x-1/2 -translate-y-1/2
              rounded-full bg-lime-400/10
              blur-[75px]
            "
          />

          {/* Círculo decorativo */}
          <div
            className="
              pointer-events-none absolute
              size-[250px] rounded-full
              border border-lime-400/[0.07]
              sm:size-[290px]
            "
          />

          <div
            className="
              pointer-events-none absolute
              size-[190px] rounded-full
              border border-lime-400/[0.05]
              sm:size-[230px]
            "
          />

          {/* Personagem NIMO */}
          <div
            className="
              relative z-10 flex w-full
              max-w-[340px] items-center justify-center
              transition-transform duration-500
              hover:-translate-y-1
            "
          >
            <NimoDevice />
          </div>

   
        </div>
      </div>

      {/* Linha inferior decorativa */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-lime-400/15 to-transparent" />
    </section>
  )
}