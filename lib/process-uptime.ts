import prisma from "@/lib/prisma";
import { registerAlert } from "./register-alert";

interface ProcessUptimeProps {
  siteId: string;
  url: string;
  status: "ONLINE" | "OFFLINE" | "UNKNOWN";
  httpStatus?: number | null;
  responseTime?: number | null;
}

export async function processUptime(data: ProcessUptimeProps) {
  const now = new Date();

  if (data.status === "UNKNOWN") {
    return null;
  }

  const hasError =
    data.httpStatus != null &&
    data.httpStatus >= 400 &&
    data.httpStatus <= 599;

  if (data.status === "ONLINE" && !hasError) {
    await prisma.monitoredSite.update({
      where: {
        id: data.siteId,
      },
      data: {
        consecutiveFailures: 0,
        lastOnlineAt: now,
      },
    });

    await prisma.alert.updateMany({
      where: {
        siteId: data.siteId,
        source: "UPTIME_MONITOR",
        status: "ACTIVE",
      },
      data: {
        status: "RESOLVED",
        resolvedAt: now,
      },
    });

    return null;
  }

  const site = await prisma.monitoredSite.update({
    where: {
      id: data.siteId,
    },
    data: {
      consecutiveFailures: {
        increment: 1,
      },
      lastOfflineAt: now,
    },
  });

  // Confirma três falhas para evitar alertas falsos
  // quando não existe um código HTTP de erro.
  if (!hasError && site.consecutiveFailures < 3) {
    return null;
  }

  return registerAlert({
    siteId: data.siteId,
    url: data.url,
    path: new URL(data.url).pathname,
    statusCode: hasError
      ? data.httpStatus!
      : undefined,
    responseTime: data.responseTime ?? undefined,
    method: "GET",
    source: "UPTIME_MONITOR",
  });
}