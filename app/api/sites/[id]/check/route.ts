import { validatePublicUrl } from "@/app/api/monitoring/validate-public-url"
import { auth } from "@/lib/auth"
import { checkSite } from "@/lib/check-site"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"




interface RouteContext {
  params: Promise<{
    id: string
  }>
}

const MIN_CHECK_INTERVAL_MS = 30_000

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      )
    }

    const { id } = await params

    const site = await prisma.monitoredSite.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!site) {
      return NextResponse.json(
        { error: "Site não encontrado." },
        { status: 404 }
      )
    }

    if (
      site.lastCheckedAt &&
      Date.now() - site.lastCheckedAt.getTime() < MIN_CHECK_INTERVAL_MS
    ) {
      return NextResponse.json({
        site,
        cached: true,
      })
    }

    const url = await validatePublicUrl(site.url)

    const result = await checkSite(url)

    const checkedAt =
      result.checkedAt && !Number.isNaN(Date.parse(result.checkedAt))
        ? new Date(result.checkedAt)
        : new Date()

    const updated = await prisma.monitoredSite.update({
      where: {
        id: site.id,
      },
      data: {
        status: result.status,
        httpStatus: result.httpStatus ?? null,
        responseTime: result.responseTime ?? null,
        visitorsOnline: result.visitorsOnline ?? null,
        lastCheckedAt: checkedAt,
      },
    })

    console.log("[NIMO] Monitoramento atualizado:", {
      id: updated.id,
      name: updated.name,
      status: updated.status,
      httpStatus: updated.httpStatus,
      responseTime: updated.responseTime,
    })

    return NextResponse.json({
      site: updated,
      cached: false,
    })
  } catch (error) {
    console.error("[NIMO] Erro no monitoramento:", error)

    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido."

    if (
      message.includes("URL não permitida") ||
      message.includes("Endereços internos") ||
      message.includes("rede pública")
    ) {
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: "Não foi possível verificar o site.",
      },
      { status: 502 }
    )
  }
}