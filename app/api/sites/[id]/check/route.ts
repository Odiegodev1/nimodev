import { validatePublicUrl } from "@/app/api/monitoring/validate-public-url";
import { auth } from "@/lib/auth";
import { checkSite } from "@/lib/check-site";

import prisma from "@/lib/prisma";
import { processUptime } from "@/lib/process-uptime";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const MIN_CHECK_INTERVAL_MS = 30_000;

const RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
};

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    // 1. Autenticação
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 2. Buscar site pertencente ao usuário
    const site = await prisma.monitoredSite.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site não encontrado." },
        { status: 404 }
      );
    }

    // 3. Evitar verificações excessivas
    if (
      site.lastCheckedAt &&
      Date.now() - site.lastCheckedAt.getTime() <
        MIN_CHECK_INTERVAL_MS
    ) {
      return NextResponse.json(
        {
          site,
          cached: true,
        },
        {
          headers: RESPONSE_HEADERS,
        }
      );
    }

    // 4. Validar URL pública
    const url = await validatePublicUrl(site.url);

    // 5. Consultar API de monitoramento
    const result = await checkSite(url);

    const checkedAt =
      result.checkedAt &&
      !Number.isNaN(Date.parse(result.checkedAt))
        ? new Date(result.checkedAt)
        : new Date();

    // 6. Validar quantidade de visitantes
    const visitorsOnline =
      typeof result.visitorsOnline === "number" &&
      Number.isFinite(result.visitorsOnline)
        ? Math.max(0, Math.floor(result.visitorsOnline))
        : site.visitorsOnline;

    // 7. Atualizar dados do site
    const updated = await prisma.monitoredSite.update({
      where: {
        id: site.id,
      },
      data: {
        status: result.status,
        httpStatus: result.httpStatus ?? null,
        responseTime: result.responseTime ?? null,
        visitorsOnline,
        lastCheckedAt: checkedAt,
      },
    });

    // 8. Processar alertas de disponibilidade
    let alert = null;
    let alertProcessingFailed = false;

    try {
      alert = await processUptime({
        siteId: updated.id,
        url: updated.url,
        status: updated.status,
        httpStatus: updated.httpStatus,
        responseTime: updated.responseTime,
      });

      if (alert) {
        console.log("[NIMO ALERT] Alerta registrado:", {
          id: alert.id,
          siteId: updated.id,
          siteName: updated.name,
          type: alert.type,
          severity: alert.severity,
          statusCode: alert.statusCode,
          occurrences: alert.occurrences,
          status: alert.status,
        });
      }
    } catch (alertError) {
      alertProcessingFailed = true;

      console.error(
        "[NIMO ALERT] Erro ao processar alerta:",
        alertError
      );
    }

    // 9. Buscar estado atualizado após processar alertas
    const currentSite = await prisma.monitoredSite.findFirst({
      where: {
        id: updated.id,
        userId: session.user.id,
      },
    });

    if (!currentSite) {
      return NextResponse.json(
        { error: "Site não encontrado." },
        { status: 404 }
      );
    }

    // 10. Consultar alertas ativos do site
    const activeAlerts = await prisma.alert.findMany({
      where: {
        siteId: currentSite.id,
        status: "ACTIVE",
      },
      orderBy: {
        lastSeenAt: "desc",
      },
      take: 10,
    });

    // 11. Logs do monitoramento
    console.log("[NIMO] Monitoramento atualizado:", {
      id: currentSite.id,
      name: currentSite.name,
      status: currentSite.status,
      httpStatus: currentSite.httpStatus,
      responseTime: currentSite.responseTime,
      visitorsOnline: currentSite.visitorsOnline,
      consecutiveFailures: currentSite.consecutiveFailures,
      recentActiveAlerts: activeAlerts.length,
      checkedAt: currentSite.lastCheckedAt,
    });

    // 12. Retornar dados atualizados
    return NextResponse.json(
      {
        site: currentSite,
        cached: false,
        alert,
        activeAlerts,
        alertProcessingFailed,
      },
      {
        headers: RESPONSE_HEADERS,
      }
    );
  } catch (error) {
    console.error("[NIMO] Erro no monitoramento:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido.";

    if (
      message.includes("URL não permitida") ||
      message.includes("Endereços internos") ||
      message.includes("rede pública")
    ) {
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Não foi possível verificar o site.",
      },
      { status: 502 }
    );
  }
}