import { UsePathName } from "./pathname";
import { SidebarLayout } from "./SidebarLayout";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark h-dvh w-full overflow-hidden bg-background text-white">
      <div className="flex h-full w-full overflow-hidden">

        {/* SIDEBAR - SOMENTE DESKTOP */}
        <aside className="hidden h-full w-80 shrink-0 overflow-y-auto border-r bg-background p-4 lg:block">
          <SidebarLayout />
        </aside>

        {/* ÁREA PRINCIPAL */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* HEADER DESKTOP */}
          <header className="hidden h-14 shrink-0 items-center border-b bg-background px-6 lg:flex">
            <h1 className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              Workspace /

              <span className="text-white">
                <UsePathName />
              </span>
            </h1>
          </header>

          {/* HEADER MOBILE */}
     

          {/* CONTEÚDO PRINCIPAL */}
          <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}