import prisma from "@/lib/prisma"
import { checkSite } from "@/lib/check-site"

export async function getDashboardStats(userId: string) {
  const [sites, devices] = await Promise.all([
    prisma.monitoredSite.findMany({
      where: { userId },
    }),

    prisma.nimoDevice.findMany({
      where: { userId },
    }),
  ])

  const now = Date.now()

  const siteStates = await Promise.all(
    sites.map(async (site) => {
      try {
        // Evita verificar o mesmo site a cada 5 segundos.
        const lastChecked = site.lastCheckedAt?.getTime() ?? 0

        const needsRefresh =
          now - lastChecked >= 30_000

        if (!needsRefresh) {
          return site
        }

        // Mesma função utilizada pela telinha física.
        const result = await checkSite(site.url)

        const updatedSite = await prisma.monitoredSite.update({
          where: {
            id: site.id,
          },
          data: {
            status: result.status,
            httpStatus: result.httpStatus,
            responseTime: result.responseTime,
            visitorsOnline: result.visitorsOnline,
            lastCheckedAt: new Date(),
          },
        })

        return updatedSite
      } catch (error) {
        console.error(
          `[NIMO] Erro ao monitorar ${site.name}:`,
          error
        )

        // Preserva o último resultado conhecido.
        return site
      }
    })
  )

  const totalSites = siteStates.length

  const onlineSites = siteStates.filter(
    (site) => site.status === "ONLINE"
  ).length

  const offlineSites = siteStates.filter(
    (site) => site.status === "OFFLINE"
  ).length

  const onlineVisitors = siteStates
    .filter((site) => site.status === "ONLINE")
    .reduce(
      (total, site) =>
        total + Math.max(0, site.visitorsOnline ?? 0),
      0
    )

  const checkedSites = siteStates.filter(
    (site) => site.lastCheckedAt !== null
  )

  const availability =
    checkedSites.length > 0
      ? (
          checkedSites.filter(
            (site) => site.status === "ONLINE"
          ).length / checkedSites.length
        ) * 100
      : null

  const connectedDevices = devices.filter((device) => {
    if (!device.lastSeenAt) return false

    const syncInterval = Math.max(
      device.syncInterval ?? 30,
      30
    )

    const timeout = syncInterval * 3 * 1000

    return (
      device.status === "ONLINE" &&
      Date.now() - device.lastSeenAt.getTime() <= timeout
    )
  }).length

  return {
    totalSites,
    onlineSites,
    offlineSites,
    onlineVisitors,
    availability,
    totalDevices: devices.length,
    connectedDevices,
    updatedAt: new Date().toISOString(),
  }
}

export type DashboardStats = Awaited<
  ReturnType<typeof getDashboardStats>
>