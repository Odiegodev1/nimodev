import { NextResponse, connection } from "next/server"

import prisma from "@/lib/prisma"
import { authenticateDevice } from "@/lib/nimo/device-auth"
import { checkSite } from "@/lib/check-site"
import { validatePublicUrl } from "@/app/api/monitoring/validate-public-url"
import { NIMO_THEMES } from "@/lib/nimo/themes"

const responseHeaders = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
}

type DeviceProject = {
  id: string
  name: string
  url: string
  status: string
  httpStatus: number | null
  responseTime: number | null
  visitorsOnline: number
  checkedAt: string | null
}

export async function GET(request: Request) {
  try {
    await connection()

    // ==========================================
    // 1. AUTENTICAR DISPOSITIVO
    // ==========================================

    const device = await authenticateDevice(request)

    if (!device) {
      console.warn("[NIMO STATE] Dispositivo não autorizado")

      return NextResponse.json(
        {
          error: "Dispositivo não autorizado.",
        },
        {
          status: 401,
          headers: responseHeaders,
        }
      )
    }

    // ==========================================
    // 2. ATUALIZAR HEARTBEAT IMEDIATAMENTE
    // ==========================================

    const now = new Date()

    const updatedDevice = await prisma.nimoDevice.update({
      where: {
        id: device.id,
      },

      data: {
        status: "ONLINE",
        lastSeenAt: now,
      },
    })

    console.log("[NIMO HEARTBEAT]", {
      deviceId: updatedDevice.id,
      deviceName: updatedDevice.name,
      userId: updatedDevice.userId,
      siteId: updatedDevice.siteId,
      status: updatedDevice.status,
      lastSeenAt: updatedDevice.lastSeenAt,
      syncInterval: updatedDevice.syncInterval,
    })

    // ==========================================
    // 3. VERIFICAR PAREAMENTO
    // ==========================================

    if (!updatedDevice.userId) {
      return NextResponse.json(
        {
          paired: false,

          device: {
            id: updatedDevice.id,
            name: updatedDevice.name,
            status: updatedDevice.status,
            syncInterval: updatedDevice.syncInterval,
            lastSeenAt:
              updatedDevice.lastSeenAt?.toISOString() ?? null,
          },

          appearance: {
            theme: "ORIGINAL",
            eyeColor: NIMO_THEMES.ORIGINAL,
          },

          project: null,

          serverTime: new Date().toISOString(),
        },
        {
          headers: responseHeaders,
        }
      )
    }

    // ==========================================
    // 4. BUSCAR USUÁRIO E SITE VINCULADO
    // ==========================================

    const [user, site] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: updatedDevice.userId,
        },

        select: {
          id: true,
          nimoTheme: true,
        },
      }),

      updatedDevice.siteId
        ? prisma.monitoredSite.findFirst({
            where: {
              id: updatedDevice.siteId,
              userId: updatedDevice.userId,
            },
          })
        : Promise.resolve(null),
    ])

    if (!user) {
      return NextResponse.json(
        {
          error: "Conta vinculada não encontrada.",
        },
        {
          status: 401,
          headers: responseHeaders,
        }
      )
    }

    // ==========================================
    // 5. PERSONALIZAÇÃO DO NIMO
    // ==========================================

    const theme = user.nimoTheme ?? "ORIGINAL"

    const appearance = {
      theme,

      eyeColor:
        NIMO_THEMES[theme] ??
        NIMO_THEMES.ORIGINAL,
    }

    // ==========================================
    // 6. MONITORAMENTO DO SITE
    // ==========================================

    let project: DeviceProject | null = null

    if (site) {
      try {
        // Impede monitoramento de endereços privados.
        const url = await validatePublicUrl(site.url)

        // Consulta os dados atuais do site.
        const result = await checkSite(url)

        const checkedAt =
          result.checkedAt &&
          !Number.isNaN(Date.parse(result.checkedAt))
            ? new Date(result.checkedAt)
            : new Date()

        // Normalizar o número de visitantes.
        const visitorsOnline =
          typeof result.visitorsOnline === "number" &&
          Number.isFinite(result.visitorsOnline)
            ? Math.max(
                0,
                Math.floor(result.visitorsOnline)
              )
            : site.visitorsOnline ?? 0

        // ======================================
        // 7. PERSISTIR OS DADOS REAIS
        // ======================================

        const updatedSite =
          await prisma.monitoredSite.update({
            where: {
              id: site.id,
            },

            data: {
              status: result.status,

              httpStatus:
                result.httpStatus ?? null,

              responseTime:
                result.responseTime ?? null,

              visitorsOnline,

              lastCheckedAt: checkedAt,
            },
          })

        // ======================================
        // 8. PREPARAR RESPOSTA PARA O ESP32
        // ======================================

        // Utiliza os valores retornados pelo Prisma.
        // Assim, a telinha recebe os mesmos dados
        // que foram persistidos no banco.

        project = {
          id: updatedSite.id,

          name: updatedSite.name,

          url: updatedSite.url,

          status: updatedSite.status,

          httpStatus: updatedSite.httpStatus,

          responseTime: updatedSite.responseTime,

          visitorsOnline:
            updatedSite.visitorsOnline ?? 0,

          checkedAt:
            updatedSite.lastCheckedAt?.toISOString() ??
            null,
        }

        console.log("[NIMO MONITORING]", {
          deviceId: updatedDevice.id,

          siteId: updatedSite.id,

          siteName: updatedSite.name,

          status: updatedSite.status,

          httpStatus: updatedSite.httpStatus,

          responseTime: updatedSite.responseTime,

          visitorsOnline:
            updatedSite.visitorsOnline,

          lastCheckedAt:
            updatedSite.lastCheckedAt,
        })
      } catch (monitorError) {
        console.error(
          "[NIMO MONITORING] Falha ao consultar site:",
          monitorError
        )

        // Busca novamente o último estado salvo.
        const latestSite =
          await prisma.monitoredSite.findFirst({
            where: {
              id: site.id,
              userId: updatedDevice.userId,
            },
          })

        if (latestSite) {
          project = {
            id: latestSite.id,

            name: latestSite.name,

            url: latestSite.url,

            status: latestSite.status,

            httpStatus: latestSite.httpStatus,

            responseTime: latestSite.responseTime,

            visitorsOnline:
              latestSite.visitorsOnline ?? 0,

            checkedAt:
              latestSite.lastCheckedAt?.toISOString() ??
              null,
          }
        }
      }
    }

    // ==========================================
    // 9. LOG FINAL DA SINCRONIZAÇÃO
    // ==========================================

    console.log("[NIMO SYNC]", {
      deviceId: updatedDevice.id,

      deviceName: updatedDevice.name,

      connected: true,

      lastSeenAt: updatedDevice.lastSeenAt,

      theme: appearance.theme,

      eyeColor: appearance.eyeColor,

      site: project?.name ?? null,

      visitorsOnline:
        project?.visitorsOnline ?? 0,

      syncInterval: updatedDevice.syncInterval,
    })

    // ==========================================
    // 10. RESPOSTA FINAL
    // ==========================================

    return NextResponse.json(
      {
        paired: true,

        device: {
          id: updatedDevice.id,

          name: updatedDevice.name,

          status: updatedDevice.status,

          syncInterval:
            updatedDevice.syncInterval,

          lastSeenAt:
            updatedDevice.lastSeenAt?.toISOString() ??
            null,
        },

        appearance,

        project,

        serverTime: new Date().toISOString(),
      },
      {
        status: 200,
        headers: responseHeaders,
      }
    )
  } catch (error) {
    console.error("[NIMO STATE] Erro interno:", error)

    return NextResponse.json(
      {
        error:
          "Não foi possível sincronizar o dispositivo.",
      },
      {
        status: 500,
        headers: responseHeaders,
      }
    )
  }
}