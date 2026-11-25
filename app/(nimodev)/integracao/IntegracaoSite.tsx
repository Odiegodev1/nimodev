"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Code2,
  ExternalLink,
  FileCode2,
  Globe2,
  Info,
  MonitorCheck,
  ShieldCheck,
  Terminal,
} from "lucide-react";

type Framework = "nextjs" | "vite" | "angular" | "html" | "api";

type Integration = {
  id: Framework;
  name: string;
  subtitle: string;
  file: string;
  language: string;
  code: string;
  instructions: string[];
  note?: string;
};

const TRACK_URL = "https://endereco-do-monitor.vercel.app/api/track";

const integrations: Integration[] = [
  {
    id: "nextjs",
    name: "Next.js",
    subtitle: "App Router / Pages Router",
    file: "app/layout.tsx",
    language: "tsx",
    code: `import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}

        <Script
          src="${TRACK_URL}"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}`,
    instructions: [
      "Abra seu projeto Next.js.",
      "Localize o arquivo app/layout.tsx.",
      "Importe o componente Script de next/script.",
      "Adicione o script dentro do body, após children.",
      "Salve e publique a atualização.",
    ],
    note: "No Pages Router, coloque o Script em pages/_app.tsx. Não substitua o layout existente: adicione apenas o import e o componente Script.",
  },
  {
    id: "vite",
    name: "React + Vite",
    subtitle: "React / TypeScript",
    file: "index.html",
    language: "html",
    code: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>Meu projeto</title>
  </head>

  <body>
    <div id="root"></div>

    <script
      src="${TRACK_URL}"
      defer
    ></script>

    <script
      type="module"
      src="/src/main.tsx"
    ></script>
  </body>
</html>`,
    instructions: [
      "Abra a pasta do projeto React + Vite.",
      "Localize o arquivo index.html na raiz.",
      "Adicione o script de monitoramento dentro do body.",
      "Mantenha o script principal do Vite.",
      "Publique seu projeto atualizado.",
    ],
  },
  {
    id: "angular",
    name: "Angular",
    subtitle: "Angular CLI",
    file: "src/index.html",
    language: "html",
    code: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />

    <title>Meu projeto Angular</title>

    <base href="/" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
  </head>

  <body>
    <app-root></app-root>

    <script
      src="${TRACK_URL}"
      defer
    ></script>
  </body>
</html>`,
    instructions: [
      "Abra o projeto Angular.",
      "Localize src/index.html.",
      "Adicione o script antes do fechamento do body.",
      "Mantenha a tag app-root.",
      "Execute o build e publique a aplicação.",
    ],
  },
  {
    id: "html",
    name: "HTML / CSS / JS",
    subtitle: "Sites estáticos",
    file: "index.html",
    language: "html",
    code: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>Meu site</title>
  </head>

  <body>
    <h1>Meu site</h1>

    <!-- Monitoramento NIMO -->
    <script
      src="${TRACK_URL}"
      defer
    ></script>
  </body>
</html>`,
    instructions: [
      "Abra o arquivo HTML principal.",
      "Localize a tag de fechamento body.",
      "Adicione o script antes dela.",
      "Salve e publique o arquivo.",
      "Acesse o site para testar o carregamento.",
    ],
  },
  {
    id: "api",
    name: "API / Backend",
    subtitle: "Integração server-side",
    file: "Exemplo de evento HTTP",
    language: "http",
    code: `# Integração de backend
#
# O script de navegador não deve ser usado
# como endpoint de ingestão server-side.
#
# Para integrar uma API, o serviço NIMO
# precisa disponibilizar um endpoint
# documentado para receber eventos.
#
# Exemplo ilustrativo de contrato:
#
# POST /api/events
# Authorization: Bearer <TOKEN>
# Content-Type: application/json
#
# {
#   "event": "page_view",
#   "projectId": "<PROJECT_ID>",
#   "timestamp": "<ISO_DATE>"
# }
#
# ATENÇÃO:
# Esse contrato é apenas uma proposta.
# Não é uma rota confirmada do monitor.`,
    instructions: [
      "Cadastre sua API ou projeto no painel NIMO.",
      "Verifique se o monitor oferece uma API de ingestão de eventos.",
      "Obtenha credenciais específicas para integração server-side.",
      "Implemente o envio conforme o contrato documentado.",
      "Valide o recebimento dos eventos no backend.",
    ],
    note: "A integração por API exige um endpoint próprio de ingestão. O endereço /api/track, por si só, não comprova suporte a requisições POST.",
  },
];

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b09]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#ff5f57]/70" />
          <div className="size-2 rounded-full bg-[#febc2e]/70" />
          <div className="size-2 rounded-full bg-[#28c840]/70" />

          <span className="ml-3 font-mono text-xs text-zinc-500">
            {language}
          </span>
        </div>

        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08]"
        >
          {copied ? (
            <>
              <Check size={14} className="text-[#b8f36b]" />
              Copiado!
            </>
          ) : (
            <>
              <Clipboard size={14} />
              Copiar código
            </>
          )}
        </button>
      </div>

      <div className="max-h-[520px] overflow-auto p-5 sm:p-6">
        <pre className="w-max min-w-full font-mono text-[12px] leading-7 text-[#c6d6c7] sm:text-[13px]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function IntegrationSteps({
  integration,
}: {
  integration: Integration;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111512] p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#b8f36b]/10">
          <Terminal size={19} className="text-[#b8f36b]" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Como instalar
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Siga as instruções abaixo
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {integration.instructions.map((instruction, index) => (
          <div key={instruction} className="flex items-start gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#b8f36b]/20 bg-[#b8f36b]/[0.06] text-xs font-semibold text-[#b8f36b]">
              {index + 1}
            </div>

            <p className="pt-1 text-sm leading-6 text-zinc-400">
              {instruction}
            </p>
          </div>
        ))}
      </div>

      {integration.note && (
        <div className="mt-6 flex gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
          <Info
            size={17}
            className="mt-0.5 shrink-0 text-amber-400"
          />

          <p className="text-xs leading-6 text-zinc-400">
            {integration.note}
          </p>
        </div>
      )}
    </div>
  );
}

export function IntegracaoSite() {
  const [selected, setSelected] = useState<Framework>("nextjs");
  const [verified, setVerified] = useState(false);

  const integration =
    integrations.find((item) => item.id === selected) ??
    integrations[0];

  function changeFramework(framework: Framework) {
    setSelected(framework);
    setVerified(false);
  }

  return (
    <section
      id="integrar-site"
      className="w-full scroll-mt-8"
    >
      {/* SECTION HEADER */}
      <div className="mb-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b8f36b]/20 bg-[#b8f36b]/[0.06] px-3 py-1.5 text-xs font-medium text-[#b8f36b]">
          <Code2 size={13} />
          Integração com seu projeto
        </div>

        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
          Conecte seu site.
          <br />
          <span className="text-zinc-500">
            Acompanhe seus visitantes.
          </span>
        </h2>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
          Instale o script de monitoramento no seu projeto para
          permitir o registro de acessos. Escolha a tecnologia
          utilizada e siga as instruções.
        </p>
      </div>

      {/* BENEFITS */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: Globe2,
            title: "Seu site",
            description: "Integração com o projeto publicado.",
          },
          {
            icon: MonitorCheck,
            title: "Seu NIMO",
            description: "Dados exibidos no dispositivo físico.",
          },
          {
            icon: ShieldCheck,
            title: "Seu controle",
            description: "Acompanhamento pelo painel NIMO.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/[0.07] bg-[#111512] p-5"
          >
            <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
              <item.icon
                size={19}
                className="text-[#b8f36b]"
              />
            </div>

            <p className="text-sm font-semibold text-white">
              {item.title}
            </p>

            <p className="mt-2 text-xs leading-6 text-zinc-500">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN PANEL */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111512]">
        <div className="border-b border-white/[0.07] px-5 py-6 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#b8f36b]/10">
              <FileCode2
                size={21}
                className="text-[#b8f36b]"
              />
            </div>

            <div>
              <h3 className="text-base font-semibold text-white">
                Instalação do rastreador
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Selecione a tecnologia do seu projeto
              </p>
            </div>
          </div>
        </div>

        {/* FRAMEWORK TABS */}
        <div className="border-b border-white/[0.07] p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {integrations.map((item) => {
              const active = selected === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeFramework(item.id)}
                  aria-pressed={active}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "border-[#b8f36b]/30 bg-[#b8f36b]/10 text-[#b8f36b]"
                      : "border-white/[0.07] bg-white/[0.025] text-zinc-400 hover:border-white/15 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FRAMEWORK CONTENT */}
        <div className="p-5 sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
            >
              {/* CODE */}
              <div className="min-w-0 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {integration.name}
                    </h4>

                    <p className="mt-1 text-xs text-zinc-500">
                      {integration.subtitle}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#090b0a] px-3 py-2">
                    <FileCode2
                      size={14}
                      className="text-[#b8f36b]"
                    />

                    <span className="font-mono text-xs text-zinc-400">
                      {integration.file}
                    </span>
                  </div>
                </div>

                <CodeBlock
                  code={integration.code}
                  language={integration.language}
                />

                <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <Info
                    size={17}
                    className="mt-0.5 shrink-0 text-[#b8f36b]"
                  />

                  <p className="text-xs leading-6 text-zinc-400">
                    O código acima é um exemplo de instalação.
                    Preserve as configurações existentes do seu
                    projeto e adicione apenas o necessário.
                  </p>
                </div>
              </div>

              {/* INSTRUCTIONS */}
              <IntegrationSteps integration={integration} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* VERIFICATION */}
      <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#111512] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#b8f36b]/10">
              <MonitorCheck
                size={21}
                className="text-[#b8f36b]"
              />
            </div>

            <div>
              <h3 className="text-base font-semibold text-white">
                Verifique a instalação
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                Depois de publicar o site, abra a página no navegador
                e confira se o script foi carregado corretamente.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVerified((value) => !value)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              verified
                ? "border border-[#b8f36b]/25 bg-[#b8f36b]/10 text-[#b8f36b]"
                : "bg-[#b8f36b] text-[#0b1009] hover:bg-[#d0ffa0]"
            }`}
          >
            {verified ? (
              <>
                <CheckCircle2 size={16} />
                Conferência marcada
              </>
            ) : (
              <>
                <Check size={16} />
                Já conferi a instalação
              </>
            )}
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Abra seu site",
              description:
                "Acesse a versão publicada do projeto.",
            },
            {
              number: "02",
              title: "Inspecione a rede",
              description:
                "Abra DevTools → Network e procure por /api/track.",
            },
            {
              number: "03",
              title: "Confira os eventos",
              description:
                "Verifique no backend se o acesso foi registrado.",
            },
          ].map((item) => (
            <div
              key={item.number}
              className="rounded-xl border border-white/[0.06] bg-[#090b0a] p-4"
            >
              <span className="font-mono text-xs text-[#b8f36b]">
                {item.number}
              </span>

              <p className="mt-3 text-sm font-medium text-white">
                {item.title}
              </p>

              <p className="mt-2 text-xs leading-6 text-zinc-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {verified && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#b8f36b]/20 bg-[#b8f36b]/[0.04] p-4">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-[#b8f36b]"
            />

            <p className="text-xs leading-6 text-zinc-300">
              Você marcou a conferência como realizada.
              Isso não representa uma validação automática do servidor.
              Confirme também se os eventos aparecem no monitoramento.
            </p>
          </div>
        )}
      </div>

      {/* FINAL CTA */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#b8f36b]/15 bg-[#b8f36b]/[0.035] p-6 sm:p-8">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Seu projeto está preparado?
          </h3>

          <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-400">
            Cadastre o site no NIMO Dev e associe-o ao dispositivo
            para acompanhar as informações disponíveis.
          </p>
        </div>

        <a
          href="/sites"
          className="inline-flex items-center gap-2 rounded-xl bg-[#b8f36b] px-5 py-3 text-sm font-semibold text-[#0b1009] transition hover:bg-[#d0ffa0]"
        >
          Gerenciar meus sites
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}