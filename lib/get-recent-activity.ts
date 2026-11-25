import "server-only"

import  prisma  from "@/lib/prisma"

export type ActivityType =
  | "success"
  | "info"
  | "device"
  | "system"
  | "warning"
  | "error"

export type ActivityIcon =
  | "check"
  | "globe"
  | "monitor"
  | "radio"
  | "alert"
  | "offline"
  | "file"

export interface ActivityItem {
  id: string
  title: string
  description: string
  date: Date
  type: ActivityType
  icon: ActivityIcon
}

export async function getRecentActivity(
  userId: string,
  limit = 6
): Promise<ActivityItem[]> {
  const [sites, devices, alerts] = await Promise.all([
    prisma.monitoredSite.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        url: true,
        status: true,
        httpStatus: true,
        responseTime: true,
        createdAt: true,
        lastCheckedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    }),

    prisma.nimoDevice.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        hardwareId: true,
        status: true,
        lastSeenAt: true,
        syncInterval: true,
      },
      orderBy: {
        lastSeenAt: {
          sort: "desc",
          nulls: "last",
        },
      },
      take: limit,
    }),

    prisma.alert.findMany({
      where: {
        site: {
          userId,
        },
      },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        status: true,
        severity: true,
        statusCode: true,
        occurrences: true,
        path: true,
        lastSeenAt: true,
        resolvedAt: true,
        site: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    }),
  ])

  const activities: ActivityItem[] = []

  // ==========================================
  // SITES
  // ==========================================

  for (const site of sites) {
    activities.push({
      id: `site-created-${site.id}`,
      title: "Novo site cadastrado",
      description: site.name,
      date: site.createdAt,
      type: "system",
      icon: "globe",
    })

    if (!site.lastCheckedAt) continue

    if (site.status === "ONLINE") {
      const details = [
        site.name,
        site.httpStatus !== null
          ? `HTTP ${site.httpStatus}`
          : null,
        site.responseTime !== null
          ? `${site.responseTime} ms`
          : null,
      ]
        .filter(Boolean)
        .join(" · ")

      activities.push({
        id: `site-check-${site.id}`,
        title: "Site respondendo normalmente",
        description: details,
        date: site.lastCheckedAt,
        type: "success",
        icon: "check",
      })
    }
  }

  // ==========================================
  // DISPOSITIVOS
  // ==========================================

  const now = Date.now()

  for (const device of devices) {
    if (!device.lastSeenAt) continue

    const timeout =
      Math.max(device.syncInterval, 10) * 3 * 1000

    const isOnline =
      device.status === "ONLINE" &&
      now - device.lastSeenAt.getTime() <= timeout

    activities.push({
      id: `device-sync-${device.id}`,

      title: isOnline
        ? `${device.name} sincronizado`
        : `Última comunicação de ${device.name}`,

      description: device.hardwareId,

      date: device.lastSeenAt,

      type: "device",

      icon: "monitor",
    })
  }

  // ==========================================
  // ALERTAS
  // ==========================================

  for (const alert of alerts) {
    const isCritical = alert.severity === "CRITICAL"
    const is404 = alert.type === "HTTP_404"

    const details = [
      alert.site.name,
      alert.path,
      alert.statusCode !== null
        ? `HTTP ${alert.statusCode}`
        : null,
      alert.occurrences > 1
        ? `${alert.occurrences} ocorrências`
        : null,
    ]
      .filter(Boolean)
      .join(" · ")

    activities.push({
      id: `alert-${alert.id}`,
      title: alert.title,
      description: details,
      date: alert.lastSeenAt,

      type: isCritical ? "error" : "warning",

      icon: is404
        ? "file"
        : isCritical
          ? "offline"
          : "alert",
    })

    if (
      alert.status === "RESOLVED" &&
      alert.resolvedAt
    ) {
      activities.push({
        id: `alert-resolved-${alert.id}`,

        title:
          alert.type === "SITE_DOWN"
            ? "Site voltou a funcionar"
            : "Incidente resolvido",

        description: alert.site.name,

        date: alert.resolvedAt,

        type: "success",

        icon: "check",
      })
    }
  }

  // Mais recentes primeiro

  return activities
    .sort(
      (a, b) =>
        b.date.getTime() - a.date.getTime()
    )
    .slice(0, limit)
}