"use client";

import { ClipboardCheck, Globe, LaptopMinimal, LayoutDashboard, ServerCog, Settings, Settings2, ShieldAlert, SquareDashedText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Visão geral",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Meus Sites",
    href: "/sites", // Ajuste aqui para a rota exata da sua tela
    icon: Globe,
  },

  {
    label: "Dispositivos",
    href: "/dispositivo", // Ajuste aqui para a rota exata da sua tela
    icon: LaptopMinimal,
  },
 
  {
    label: "Integração",
    href: "/integracao", // Ajuste aqui para a rota exata da sua tela
    icon: ServerCog,
  },
  {
    label: "Alertas",
    href: "/alerta", // Ajuste aqui para a rota exata da sua tela
    icon: ShieldAlert,
  },
];

const navItemsConta = [
  {
    label: "Configurações",
    href: "/config", // Ajuste aqui para a rota exata da sua tela
    icon: Settings,
  },

]

export function SidebarLayout() {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex w-full max-w-[200px] flex-col items-center justify-center gap-14 ">
      {/* Logo */}
      <div className="mt-4 flex items-center ">
       
       <div className="flex items-center font-mono text-2xl font-extrabold">
        <h1 className="">Nimo</h1><p className="text-lima">.</p>
      
       </div>
      </div>

      {/* Navigation Section */}
      <div className="flex w-full flex-col items-start gap-2.5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground">
          WORKSPACE
        </p>
        <nav className="w-full space-y-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Verifica se a rota atual é exatamente igual ao href do link
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 w-full items-center gap-3 rounded-md border px-3 text-sm transition-colors ${
                  isActive
                    ? "border-lima bg-lima/20 text-white"
                    : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <p className="text-xs mt-5 font-semibold tracking-wider text-muted-foreground">
          CONTA
        </p>
        <nav className="w-full space-y-2.5">
          {navItemsConta.map((item) => {
            const Icon = item.icon;
            // Verifica se a rota atual é exatamente igual ao href do link
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 w-full items-center gap-3 rounded-md border px-3 text-sm transition-colors ${
                  isActive
                    ? "border-lima bg-lima/20 text-white"
                    : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
