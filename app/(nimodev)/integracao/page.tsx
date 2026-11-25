"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  Globe2,
  Link2,
  Monitor,
  Power,
  RefreshCw,
  Router,
  ShieldCheck,
  Smartphone,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
// Ajuste o caminho conforme a localização do seu componente.
import { NimoDevice } from "@/components/NimoDevice";
import { IntegracaoSite } from "./IntegracaoSite";

type Step = {
  id: number;
  title: string;
  description: string;
  duration: string;
};
const steps: Step[] = [
  {
    id: 1,
    title: "Ligue seu NIMO",
    description: "Prepare seu dispositivo para a primeira configuração.",
    duration: "1 min",
  },
  {
    id: 2,
    title: "Conecte ao NIMO-Setup",
    description: "Conecte seu celular à rede criada pelo dispositivo.",
    duration: "2 min",
  },
  {
    id: 3,
    title: "Configure o Wi-Fi",
    description: "Escolha a rede que o NIMO utilizará.",
    duration: "2 min",
  },
  {
    id: 4,
    title: "Vincule sua conta",
    description: "Utilize o código exibido na tela do NIMO.",
    duration: "2 min",
  },
  {
    id: 5,
    title: "Escolha seu site",
    description: "Defina qual projeto será monitorado.",
    duration: "1 min",
  },
  {
    id: 6,
    title: "Tudo pronto!",
    description: "Seu NIMO está preparado para acompanhar seu projeto.",
    duration: "Pronto",
  },
];
const faqs = [
  {
    question: "Meu NIMO não aparece na lista de redes Wi-Fi.",
    answer:
      "Verifique se o dispositivo está ligado. A rede NIMO-Setup aparece quando não existe uma configuração válida ou quando o modo de configuração é ativado. Caso já esteja conectado a uma rede, será necessário entrar no modo de reconfiguração.",
  },
  {
    question: "Posso utilizar uma rede Wi-Fi de 5 GHz?",
    answer:
      "Não. O ESP32 utilizado pelo NIMO funciona com redes Wi-Fi de 2,4 GHz. Se o roteador oferecer as duas frequências, selecione a rede de 2,4 GHz.",
  },
  {
    question: "Preciso configurar o Wi-Fi toda vez que ligar?",
    answer:
      "Não. Depois de conectar com sucesso, o NIMO salva a rede na memória interna e tenta reconectar automaticamente nas próximas inicializações.",
  },
  {
    question: "O que acontece se minha internet cair?",
    answer:
      "O NIMO continua ligado e tenta restabelecer a conexão. Enquanto estiver desconectado, os dados do monitoramento não serão atualizados.",
  },
  {
    question: "Posso monitorar qualquer site?",
    answer:
      "Você pode selecionar um site cadastrado e autorizado na sua conta. O NIMO consulta os dados disponibilizados pelo sistema de monitoramento.",
  },
  {
    question: "Como funciona o número de visitantes?",
    answer:
      "O NIMO exibe a quantidade de visitantes informada pelo serviço de monitoramento. Para representar visitantes reais em tempo real, a origem desses dados precisa contar as sessões ativas do site.",
  },
];
function StepIndicator({
step,
active,
completed,
onClick,
}: {
  step: Step;
  active: boolean;
  completed: boolean;
  onClick: () => void;
}) {
  return (
    <button
            type="button"
            onClick={onClick}
            aria-current={active ? "step" : undefined}
            className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
        active
          ? "border-[#b8f36b]/35 bg-[#b8f36b]/[0.07]"
          : "border-transparent hover:border-white/[0.07] hover:bg-white/[0.025]"
      }`}
    >
      <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
          completed
            ? "border-[#b8f36b]/30 bg-[#b8f36b]/15 text-[#b8f36b]"
            : active
              ? "border-[#b8f36b] bg-[#b8f36b] text-[#0b1009]"
              : "border-white/10 bg-white/[0.04] text-zinc-500"
        }`}
      >
        {completed ? <Check size={18} /> : `0${step.id}`}
      </div>
      <div className="min-w-0 flex-1">
        <p
            className={`truncate text-sm font-medium ${
            active ? "text-white" : "text-zinc-400"
          }`}
        >
          {step.title}
        </p>
        <p className="mt-1 text-xs text-zinc-600">{step.duration}</p>
      </div>
      {active && <ArrowRight size={16} className="text-[#b8f36b]" />}
    </button>
  );
}
function SectionBadge({
children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#b8f36b]/20 bg-[#b8f36b]/[0.07] px-3 py-1.5 text-xs font-medium text-[#b8f36b]">
      <span className="size-1.5 rounded-full bg-[#b8f36b]" />
      {children}
    </span>
  );
}
function InstructionCard({
number,
title,
description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-xs font-semibold text-zinc-300">
        {number}
      </span>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500">
          {description}
        </p>
      </div>
    </div>
  );
}
function DeviceScreen({
mode,
}: {
  mode: "setup" | "pairing" | "online";
}) {
  return (
    <div className="mx-auto w-full max-w-[390px]">
      <div className="rounded-[28px] border border-[#3a443d] bg-[#202722] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-[5px] border-[#080c09] bg-[#080b09] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">
              nimo <span className="font-normal text-zinc-500">/dev</span>
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span
            className={`size-1.5 rounded-full ${
                  mode === "online" ? "bg-[#b8f36b]" : "bg-amber-400"
                }`}
              />
              {mode === "online" ? "conectado" : "configuração"}
            </span>
          </div>
          {mode === "setup" && (
            <div className="flex h-[85%] flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#b8f36b]/10">
                <Wifi size={28} className="text-[#b8f36b]" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Configure o Wi-Fi
              </h3>
              <p className="mt-2 text-xs text-zinc-500">
                Conecte seu celular à rede
              </p>
              <div className="mt-4 rounded-lg border border-[#b8f36b]/20 bg-[#b8f36b]/[0.06] px-5 py-2.5">
                <span className="font-mono text-sm font-semibold text-[#b8f36b]">
                  NIMO-Setup
                </span>
              </div>
              <p className="mt-3 text-[11px] text-zinc-400">
                Senha: nimo12345
              </p>
              <p className="mt-1 font-mono text-[11px] text-zinc-500">
                192.168.4.1
              </p>
            </div>
          )}
          {mode === "pairing" && (
            <div className="flex h-[85%] flex-col items-center justify-center text-center">
              <span className="text-xs font-medium tracking-[0.2em] text-[#b8f36b]">
                CONECTAR NIMO
              </span>
              <p className="mt-3 text-xs text-zinc-500">
                Código de pareamento
              </p>
              <div className="mt-5 w-full rounded-xl border border-white/10 bg-[#1b241f] px-4 py-5">
                <p className="font-mono text-2xl font-bold tracking-[0.15em] text-[#b8f36b] sm:text-3xl">
                  NIMO-XXXX
                </p>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                Exemplo ilustrativo
              </p>
            </div>
          )}
          {mode === "online" && (
            <div className="flex h-[85%] flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#b8f36b]/10">
                <CheckCircle2 size={34} className="text-[#b8f36b]" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Tudo conectado!
              </h3>
              <p className="mt-2 text-xs text-zinc-500">
                Seu NIMO está pronto para monitorar.
              </p>
              <div className="mt-5 flex items-center gap-2 rounded-full border border-[#b8f36b]/20 bg-[#b8f36b]/[0.06] px-4 py-2 text-xs text-[#b8f36b]">
                <span className="size-1.5 rounded-full bg-[#b8f36b]" />
                Dispositivo online
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-5 text-center text-xs text-zinc-600">
        Prévia ilustrativa da tela do NIMO
      </p>
    </div>
  );
}
function StepContent({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <div className="space-y-6">
          <SectionBadge>Etapa 01 · Inicialização</SectionBadge>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Primeiro, ligue seu NIMO.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              Conecte seu dispositivo a uma fonte de alimentação USB
              compatível. O NIMO iniciará automaticamente e verificará
              se já existe uma rede Wi-Fi configurada.
            </p>
          </div>
          <div className="grid gap-3">
            <InstructionCard
number="01"
title="Conecte a alimentação"
description="Utilize um cabo USB e uma fonte compatíveis com sua placa."
            />
            <InstructionCard
number="02"
title="Aguarde a inicialização"
description="A tela deverá acender e iniciar o sistema NIMO."
            />
            <InstructionCard
number="03"
title="Verifique a tela"
description="Se não houver uma rede configurada, o NIMO apresentará as instruções de Wi-Fi."
            />
          </div>
          <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
            <div className="flex gap-3">
              <Zap size={18} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Já utilizou seu NIMO antes?
                </p>
                <p className="mt-1 text-xs leading-6 text-zinc-500">
                  Se uma rede salva estiver disponível, o dispositivo
                  poderá conectar automaticamente e pular a configuração
                  inicial.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="space-y-6">
          <SectionBadge>Etapa 02 · Conexão local</SectionBadge>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Conecte-se ao NIMO-Setup.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              Quando não encontra uma rede configurada, o NIMO cria
              temporariamente seu próprio ponto de acesso Wi-Fi.
              Utilize seu celular para se conectar a ele.
            </p>
          </div>
          <div className="rounded-2xl border border-[#b8f36b]/20 bg-[#b8f36b]/[0.035] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#b8f36b]/10">
                <Wifi size={23} className="text-[#b8f36b]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Nome da rede</p>
                <p className="mt-1 font-mono text-lg font-semibold text-white">
                  NIMO-Setup
                </p>
              </div>
              <span className="ml-auto rounded-full bg-[#b8f36b]/10 px-2.5 py-1 text-[10px] font-medium text-[#b8f36b]">
                Wi-Fi local
              </span>
            </div>
            <div className="my-5 h-px bg-white/[0.07]" />
            <p className="text-xs text-zinc-500">Senha da rede</p>
            <p className="mt-2 font-mono text-lg tracking-wide text-white">
              nimo12345
            </p>
          </div>
          <div className="grid gap-3">
            <InstructionCard
number="01"
title="Abra as configurações do celular"
description="Acesse as configurações de Wi-Fi do Android ou iPhone."
            />
            <InstructionCard
number="02"
title="Selecione NIMO-Setup"
description="Procure a rede criada pelo dispositivo e informe a senha exibida acima."
            />
            <InstructionCard
number="03"
title="Permaneça conectado"
description="Se o celular avisar que a rede está sem internet, escolha continuar conectado."
            />
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#b8f36b]" />
            <p className="text-xs leading-6 text-zinc-400">
              Essa conexão é utilizada somente para configurar o
              dispositivo. Ela não fornece acesso à internet.
            </p>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="space-y-6">
          <SectionBadge>Etapa 03 · Configuração de rede</SectionBadge>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Configure sua rede Wi-Fi.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              Com o celular conectado ao NIMO-Setup, abra o portal de
              configuração. Escolha a rede que o dispositivo utilizará
              para acessar o sistema de monitoramento.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#101411] p-5">
            <div className="mb-5 flex items-center gap-2 border-b border-white/[0.07] pb-4">
              <Globe2 size={16} className="text-zinc-500" />
              <span className="font-mono text-sm text-zinc-300">
                192.168.4.1
              </span>
              <ExternalLink size={14} className="ml-auto text-zinc-600" />
            </div>
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#b8f36b] text-xl font-black text-[#0b1009]">
              N
            </div>
            <h3 className="text-xl font-semibold text-white">
              Conecte seu NIMO
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Selecione sua rede Wi-Fi para ativar seu assistente.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="mb-2 text-xs text-zinc-400">Rede Wi-Fi</p>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#090b0a] px-4 py-3.5 text-sm text-zinc-300">
                  Minha rede Wi-Fi
                  <ChevronDown size={16} className="text-zinc-600" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-zinc-400">Senha da rede</p>
                <div className="rounded-xl border border-white/10 bg-[#090b0a] px-4 py-3.5 text-sm tracking-widest text-zinc-400">
                  ••••••••••••
                </div>
              </div>
              <div className="rounded-xl bg-[#b8f36b] px-4 py-3.5 text-center text-sm font-semibold text-[#0b1009]">
                Conectar NIMO
              </div>
            </div>
            <p className="mt-4 text-center text-[11px] text-zinc-600">
              Prévia ilustrativa do portal de configuração
            </p>
          </div>
          <div className="grid gap-3">
            <InstructionCard
number="01"
title="Abra o navegador"
description="Digite 192.168.4.1 na barra de endereços."
            />
            <InstructionCard
number="02"
title="Selecione sua rede"
description="Escolha uma rede Wi-Fi de 2,4 GHz na lista."
            />
            <InstructionCard
number="03"
title="Informe a senha"
description="Digite a senha e pressione Conectar NIMO."
            />
            <InstructionCard
number="04"
title="Aguarde a conexão"
description="Quando conectar, o NIMO salvará as credenciais e encerrará a rede de configuração."
            />
          </div>
        </div>
      );
    case 3:
      return (
        <div className="space-y-6">
          <SectionBadge>Etapa 04 · Pareamento</SectionBadge>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Vincule o NIMO à sua conta.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              Depois de conectar ao Wi-Fi, o dispositivo se comunica
              com o servidor NIMO. Se ainda não estiver vinculado,
              aparecerá um código de pareamento na tela.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#101411] p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#b8f36b]/10">
                <Link2 size={20} className="text-[#b8f36b]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Código de pareamento
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Exibido diretamente na tela do NIMO
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-[#b8f36b]/25 bg-[#b8f36b]/[0.035] px-4 py-7 text-center">
              <span className="font-mono text-2xl font-semibold tracking-[0.15em] text-[#b8f36b] sm:text-3xl">
                NIMO-XXXX
              </span>
              <p className="mt-3 text-xs text-zinc-500">
                Exemplo — utilize o código real do seu dispositivo
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            <InstructionCard
number="01"
title="Observe a tela do NIMO"
description="Aguarde o código de pareamento aparecer."
            />
            <InstructionCard
number="02"
title="Abra o painel da sua conta"
description="Acesse a área de dispositivos do NIMO Dev."
            />
            <InstructionCard
number="03"
title="Informe o código"
description="Digite o código exatamente como aparece na tela."
            />
            <InstructionCard
number="04"
title="Confirme o vínculo"
description="Depois da confirmação, o NIMO poderá receber as configurações associadas à sua conta."
            />
          </div>
          <Link
            href="/dispositivos"
            className="inline-flex items-center gap-2 rounded-xl bg-[#b8f36b] px-5 py-3 text-sm font-semibold text-[#0b1009] transition hover:bg-[#d0ffa0]"
          >
            Ir para meus dispositivos
            <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-zinc-600">
            Se a rota de dispositivos no seu projeto for diferente,
            ajuste o endereço desse botão.
          </p>
        </div>
      );
    case 4:
      return (
        <div className="space-y-6">
          <SectionBadge>Etapa 05 · Monitoramento</SectionBadge>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Escolha o site que será monitorado.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              Agora que seu NIMO está vinculado, selecione um dos sites
              cadastrados na plataforma para acompanhar seus dados
              diretamente na telinha.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Globe2,
                title: "Status",
                description: "Online ou offline",
              },
              {
                icon: Zap,
                title: "Resposta",
                description: "HTTP e latência",
              },
              {
                icon: Monitor,
                title: "Visitantes",
                description: "Contagem disponível",
              },
            ].map((item) => (
              <div
            key={item.title}
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <item.icon size={19} className="text-[#b8f36b]" />
                <p className="mt-4 text-sm font-medium text-white">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-3">
            <InstructionCard
number="01"
title="Cadastre seu site"
description="Adicione o endereço do projeto que deseja acompanhar."
            />
            <InstructionCard
number="02"
title="Abra as configurações do dispositivo"
description="Selecione o NIMO que acabou de vincular."
            />
            <InstructionCard
number="03"
title="Associe o site"
description="Escolha o site cadastrado e salve a configuração."
            />
            <InstructionCard
number="04"
title="Aguarde a sincronização"
description="O dispositivo buscará as informações conforme o intervalo configurado."
            />
          </div>
          <Link
            href="/sites"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.09]"
          >
            Gerenciar meus sites
            <ArrowRight size={16} />
          </Link>
        <a href="#integrar-site" className="ml-0 inline-flex items-center gap-2 rounded-xl border border-[#b8f36b]/30 bg-[#b8f36b]/10 px-5 py-3 text-sm font-medium text-[#b8f36b] transition hover:bg-[#b8f36b]/15 sm:ml-3">
          Instalar rastreador no site <ArrowRight size={16} />
        </a>
        </div>
      );
    default:
      return (
        <div className="space-y-6">
          <SectionBadge>Etapa 06 · Concluído</SectionBadge>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Seu NIMO está pronto!
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              Você concluiu o guia de configuração. Com o dispositivo
              conectado, vinculado e associado a um site, o NIMO poderá
              acompanhar seu projeto diretamente da sua mesa.
            </p>
          </div>
          <div className="rounded-2xl border border-[#b8f36b]/20 bg-[#b8f36b]/[0.04] p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-[#b8f36b]" />
              <div>
                <p className="font-semibold text-white">
                  Configuração concluída
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Agora é só acompanhar seus projetos.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#b8f36b] px-5 py-3.5 text-sm font-semibold text-[#0b1009] transition hover:bg-[#d0ffa0]"
            >
              Ir para o dashboard
              <ArrowRight size={16} />
            </Link>
            <Link
            href="/dispositivos"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-white/[0.09]"
            >
              Meus dispositivos
              <Monitor size={16} />
            </Link>
          </div>
          <p className="text-xs leading-6 text-zinc-600">
            Este guia não verifica automaticamente o estado real do
            dispositivo. Confirme no painel se o NIMO aparece online.
          </p>
        </div>
      );
  }
}
export default function IntegracaoPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const progress = Math.round(
    (completedSteps.length / steps.length) * 100
  );
  function nextStep() {
    setCompletedSteps((previous) =>
      previous.includes(activeStep)
        ? previous
        : [...previous, activeStep]
    );
    if (activeStep < steps.length - 1) {
      setActiveStep((previous) => previous + 1);
    }
  }
  function previousStep() {
    setActiveStep((previous) => Math.max(0, previous - 1));
  }
  function restartGuide() {
    setActiveStep(0);
    setCompletedSteps([]);
  }
  const currentStep = steps[activeStep];
  const previewMode =
    activeStep <= 2
      ? "setup"
      : activeStep === 3
        ? "pairing"
        : "online";
  return (
    <main className="min-h-screen bg-[#090b0a] text-white">
      {/* HEADER */}
      <div className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-[#b8f36b]/20 bg-[#b8f36b]/10">
              <Link2 size={19} className="text-[#b8f36b]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">
                Integração NIMO
              </h1>
              <p className="mt-0.5 text-xs text-zinc-500">
                Guia de configuração do dispositivo
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-xs font-medium text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            Voltar ao painel
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        {/* HERO */}
        <div className="mb-12 grid items-center gap-8 lg:grid-cols-[1fr_420px]">
          <div>
            <SectionBadge>Primeiros passos</SectionBadge>
            <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.12] tracking-[-0.045em] text-white sm:text-5xl lg:text-[58px]">
              Seu NIMO.
              <br />
              <span className="text-[#b8f36b]">Pronto para começar.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">
              Da primeira conexão ao monitoramento do seu site.
              Configure seu NIMO em poucos minutos com um guia
              simples, visual e sem complicações.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <CheckCircle2 size={17} className="text-[#b8f36b]" />
                6 etapas
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Zap size={17} className="text-[#b8f36b]" />
                Cerca de 8 minutos
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <ShieldCheck size={17} className="text-[#b8f36b]" />
                Sem programação
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-full bg-[#b8f36b]/[0.025] blur-3xl" />
            <NimoDevice
            visitors={2}
online
            className="relative min-h-[360px]"
            />
          </div>
        </div>
        {/* PROGRESS */}
        <div className="mb-7 rounded-2xl border border-white/[0.07] bg-[#111512] p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">
                Progresso da configuração
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Etapa {activeStep + 1} de {steps.length} ·{" "}
                {currentStep.title}
              </p>
            </div>
            <span className="font-mono text-lg font-semibold text-[#b8f36b]">
              {progress}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso da configuração"
            className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"
          >
            <motion.div
            className="h-full rounded-full bg-[#b8f36b]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
            />
          </div>
        </div>
        {/* MAIN CONTENT */}
        <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="rounded-2xl border border-white/[0.07] bg-[#111512] p-3 lg:sticky lg:top-6">
            <div className="px-4 pb-3 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                Etapas de integração
              </p>
            </div>
            <div className="space-y-1">
              {steps.map((step, index) => (
                <StepIndicator
            key={step.id}
step={step}
active={activeStep === index}
completed={completedSteps.includes(index)}
            onClick={() => setActiveStep(index)}
                />
              ))}
            </div>
            <div className="mx-4 my-4 h-px bg-white/[0.07]" />
            <div className="px-4 pb-4">
              <div className="flex items-start gap-3">
                <CircleHelp
            size={17}
            className="mt-0.5 shrink-0 text-zinc-500"
                />
                <div>
                  <p className="text-xs font-medium text-zinc-300">
                    Precisa de ajuda?
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    Consulte as dúvidas frequentes ao final do guia.
                  </p>
                </div>
              </div>
            </div>
          </aside>
          {/* STEP DETAILS */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111512]">
            <div className="grid min-h-[620px] xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="min-w-0 p-5 sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
                  >
                    <StepContent step={activeStep} />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* DEVICE PREVIEW */}
              <div className="flex flex-col justify-center border-t border-white/[0.07] bg-[#0d110e] p-6 xl:border-l xl:border-t-0">
                <div className="mb-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                    Visualização
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Veja o que aparece no dispositivo durante esta etapa.
                  </p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
            key={previewMode}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
                  >
                    <DeviceScreen mode={previewMode} />
                  </motion.div>
                </AnimatePresence>
                <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2">
                    {activeStep <= 2 ? (
                      <Wifi size={15} className="text-[#b8f36b]" />
                    ) : activeStep === 3 ? (
                      <Link2 size={15} className="text-[#b8f36b]" />
                    ) : (
                      <CheckCircle2
            size={15}
            className="text-[#b8f36b]"
                      />
                    )}
                    <p className="text-xs font-medium text-zinc-300">
                      {activeStep <= 2
                        ? "Configuração de Wi-Fi"
                        : activeStep === 3
                          ? "Vinculação do dispositivo"
                          : "Monitoramento do projeto"}
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    {activeStep <= 2
                      ? "O NIMO precisa de uma rede de 2,4 GHz para se comunicar com o servidor."
                      : activeStep === 3
                        ? "O código de pareamento é gerado pelo dispositivo e deve ser informado no painel."
                        : "Os dados exibidos são sincronizados com o site associado ao dispositivo."}
                  </p>
                </div>
              </div>
            </div>
            {/* NAVIGATION */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] px-5 py-5 sm:px-8">
              <button
            type="button"
            onClick={previousStep}
            disabled={activeStep === 0}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft size={16} />
                Anterior
              </button>
              {activeStep === steps.length - 1 ? (
                <button
            type="button"
            onClick={() => {
                    setCompletedSteps(steps.map((_, index) => index));
                  }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#b8f36b] px-5 py-3 text-sm font-semibold text-[#0b1009] transition hover:bg-[#d0ffa0]"
                >
                  Marcar guia como concluído
                  <Check size={16} />
                </button>
              ) : (
                <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-2 rounded-xl bg-[#b8f36b] px-5 py-3 text-sm font-semibold text-[#0b1009] transition hover:bg-[#d0ffa0]"
                >
                  Próxima etapa
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </section>
        </div>
        {/* INSTALACAO DO RASTREADOR */}
      <div className="mt-20" id="integrar-site">
        <IntegracaoSite />
      </div>
      {/* HELP SECTION */}
        <section className="mt-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionBadge>Central de ajuda</SectionBadge>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
                Dúvidas frequentes.
              </h2>
              <p className="mt-3 text-sm text-zinc-500">
                Respostas rápidas para os problemas mais comuns.
              </p>
            </div>
            <button
            type="button"
            onClick={restartGuide}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <RefreshCw size={15} />
              Reiniciar guia
            </button>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
            key={faq.question}
            className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#111512]"
                >
                  <button
            type="button"
            onClick={() => setOpenFaq(isOpen ? null : index)}
            aria-expanded={isOpen}
            className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="text-sm font-medium text-zinc-200">
                      {faq.question}
                    </span>
                    <ChevronDown
            size={17}
            className={`shrink-0 text-zinc-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
                      >
                        <p className="border-t border-white/[0.06] px-5 py-5 text-sm leading-7 text-zinc-400">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
        {/* FOOTER */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] py-7">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">nimo</span>
            <span className="text-sm text-zinc-600">/dev</span>
          </div>
          <p className="text-xs text-zinc-600">
            Seu pequeno companheiro digital.
          </p>
        </div>
      </div>
    </main>
  );
}