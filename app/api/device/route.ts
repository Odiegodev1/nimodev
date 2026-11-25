import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import prisma  from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      )
    }

    const devices = await prisma.nimoDevice.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        hardwareId: true,
        status: true,
        syncInterval: true,
        lastSeenAt: true,
        firmwareVersion: true,
        createdAt: true,

        site: {
          select: {
            id: true,
            name: true,
            url: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const now = Date.now()

    const result = devices.map((device) => {
      const online =
        device.lastSeenAt !== null &&
        now - device.lastSeenAt.getTime() <
          Math.max(device.syncInterval * 3000, 120_000)

      return {
        ...device,
        status: online ? "ONLINE" : "OFFLINE",
      }
    })

    return NextResponse.json({
      devices: result,
    })
  } catch (error) {
    console.error("[NIMO] List devices:", error)

    return NextResponse.json(
      { error: "Erro ao buscar dispositivos." },
      { status: 500 }
    )
  }
}