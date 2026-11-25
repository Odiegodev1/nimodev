import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { hashDeviceSecret } from "@/lib/nimo/device-auth"


const schema = z.object({
  code: z.string().regex(/^\d{8}$/),
  name: z.string().trim().min(2).max(60),
  siteId: z.string().min(1),
  syncInterval: z.number().int().min(30).max(3600),
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      )
    }

    const { code, name, siteId, syncInterval } = parsed.data

    const site = await prisma.monitoredSite.findFirst({
      where: {
        id: siteId,
        userId: session.user.id,
      },
    })

    if (!site) {
      return NextResponse.json(
        { error: "Site não encontrado." },
        { status: 404 }
      )
    }

    const codeHash = hashDeviceSecret(code)

    const pairing = await prisma.nimoPairingCode.findUnique({
      where: { codeHash },
      include: { device: true },
    })

    if (
      !pairing ||
      pairing.usedAt ||
      pairing.expiresAt <= new Date() ||
      pairing.device.userId
    ) {
      return NextResponse.json(
        { error: "Código inválido ou expirado." },
        { status: 400 }
      )
    }

    const device = await prisma.$transaction(async (tx) => {
      const claimed = await tx.nimoPairingCode.updateMany({
        where: {
          id: pairing.id,
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        data: {
          usedAt: new Date(),
        },
      })

      if (claimed.count !== 1) {
        throw new Error("Código já utilizado.")
      }

      const updated = await tx.nimoDevice.updateMany({
        where: {
          id: pairing.deviceId,
          userId: null,
        },
        data: {
          userId: session?.user?.id,
          siteId,
          name,
          syncInterval,
        },
      })

      if (updated.count !== 1) {
        throw new Error("Dispositivo já vinculado.")
      }

      return tx.nimoDevice.findUniqueOrThrow({
        where: { id: pairing.deviceId },
      })
    })

    return NextResponse.json({
      success: true,
      device: {
        id: device.id,
        name: device.name,
        siteId: device.siteId,
        syncInterval: device.syncInterval,
      },
    })
  } catch (error) {
    console.error("[NIMO] Pair device:", error)

    return NextResponse.json(
      { error: "Não foi possível vincular o dispositivo." },
      { status: 400 }
    )
  }
}