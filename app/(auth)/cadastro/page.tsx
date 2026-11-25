


import Link from "next/link";
import { NimoDevice } from "@/components/NimoDevice";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,

  LockKeyhole,
  Mail,
  ShieldCheck,
  Wifi,
  Activity,
  Cpu,
  Sidebar,
} from "lucide-react";
import { FormContentCadastro } from "./form/formcontentcadastro";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const instant = false
export default async function LoginPage() {
const session = await auth()
if(session){
  return redirect("/")
}
  return (
    <main className="flex min-h-screen w-full bg-white">
      {/* =====================================================
          LADO ESQUERDO — NIMO
      ===================================================== */}
      <section className="relative hidden min-h-screen w-1/2 flex-col overflow-hidden bg-[#090b0a] p-8 text-white lg:flex xl:p-12">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-180px] left-[-180px] size-[450px] rounded-full bg-[#b8f36b]/5 blur-[130px]" />

          <div className="absolute right-[-150px] bottom-[-150px] size-[450px] rounded-full bg-[#b8f36b]/5 blur-[130px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#b8f36b 1px, transparent 1px), linear-gradient(90deg, #b8f36b 1px, transparent 1px)",
              backgroundSize: "55px 55px",
            }}
          />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold tracking-[-2px]">
              nimo
              <span className="ml-1 font-normal text-[#b8f36b]">
                /dev
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-[#303a31] bg-[#171c18] px-3 py-2 text-[10px] font-medium tracking-wide text-[#a6b1a6]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#b8f36b] opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-[#b8f36b]" />
            </span>
            PROJETO ACADÊMICO
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 flex flex-1 flex-col justify-center">
          {/* Texto */}
          <div className="mt-10">
            <div className="mb-5 flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#b8f36b] uppercase">
              <span className="h-px w-6 bg-[#b8f36b]" />
              Hardware + Software
            </div>

            <h1 className="max-w-xl text-[clamp(35px,3.3vw,56px)] leading-[1.1] font-semibold tracking-[-2.5px]">
              Seu mundo digital,
              <br />
              <span className="text-[#b8f36b]">
                sempre por perto.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#8f9b91] xl:text-base">
              Conheça o NIMO, seu pequeno companheiro inteligente.
              Monitore seus projetos, acompanhe visitantes e fique
              conectado ao que realmente importa.
            </p>
          </div>

          {/* Dispositivo animado */}
          <div className="relative -my-6 flex min-h-[330px] items-center justify-center xl:min-h-[400px]">
            <NimoDevice
              visitors={2}
              online
              className="!min-h-[350px] xl:!min-h-[420px]"
            />
          </div>

          {/* Informações */}
          <div className="grid grid-cols-3 gap-3">
            <Feature
              icon={<Cpu size={17} />}
              title="ESP32"
              description="Hardware"
            />

            <Feature
              icon={<Wifi size={17} />}
              title="Wi-Fi"
              description="Conectividade"
            />

            <Feature
              icon={<Activity size={17} />}
              title="Tempo real"
              description="Monitoramento"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-8 flex items-center justify-between border-t border-[#273028] pt-6">
          <div>
            <p className="text-xs font-medium text-[#d1d9d0]">
              NIMO /dev
            </p>
            <p className="mt-1 text-[11px] text-[#69766b]">
              Um projeto acadêmico de tecnologia e inovação.
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-[#a0afa0] transition hover:text-[#b8f36b]"
          >
            Conhecer projeto
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* =====================================================
          LADO DIREITO — LOGIN
      ===================================================== */}
      <section className="relative flex min-h-screen w-full flex-col bg-[#fafbf9] text-[#171b17] lg:w-1/2">
        {/* Header mobile */}
        <div className="flex items-center justify-between px-6 pt-7 lg:hidden">
          <Link
            href="/"
            className="font-mono text-2xl font-bold tracking-[-2px]"
          >
            nimo
            <span className="ml-1 text-[#77a63d]">/dev</span>
          </Link>

          <span className="rounded-full border border-[#e0e6dc] px-3 py-1.5 text-[10px] font-medium text-[#69766b]">
            NIMO MONITOR
          </span>
        </div>

        {/* Link cadastro desktop */}
        <div className="hidden items-center justify-end gap-2 px-10 pt-10 text-sm lg:flex">
          <span className="text-[#8a9389]">
            Ainda não tem uma conta?
          </span>

          <Link
            href="/cadastro"
            className="flex items-center gap-1 font-semibold text-[#263b20] transition hover:text-[#77a63d]"
          >
            Criar conta
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Formulário */}
       <FormContentCadastro />

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-[#e8ede6] px-6 py-6 text-[11px] text-[#a0aaa0] sm:px-10">
          <span>© 2026 NIMO /dev</span>

          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="hover:text-[#567b39]">
              Privacidade
            </Link>

            <Link href="/termos" className="hover:text-[#567b39]">
              Termos de uso
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}

/* =====================================================
   COMPONENTE AUXILIAR
===================================================== */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#29332b] bg-[#151a16]/80 p-3.5 backdrop-blur-sm">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#344235] bg-[#202b20] text-[#b8f36b]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#e3eae1]">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-[#748174]">
          {description}
        </p>
      </div>
    </div>
  );
}