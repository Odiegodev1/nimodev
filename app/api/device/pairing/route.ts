import { randomInt } from "node:crypto"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import {
  authenticateDevice,
  hashDeviceSecret,
} from "@/lib/nimo/device-auth"



export async function POST(request: Request) {
  try {
    const device = await authenticateDevice(request)

    if (!device) {
      return NextResponse.json(
        { error: "Dispositivo não autorizado." },
        { status: 401 }
      )
    }

    if (device.userId) {
      return NextResponse.json(
        { error: "Dispositivo já vinculado." },
        { status: 409 }
      )
    }

    const recentCode = await prisma.nimoPairingCode.findFirst({
      where: {
        deviceId: device.id,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    // O código anterior não pode ser recuperado porque
    // armazenamos apenas seu hash. Invalidamos e criamos outro.
    if (recentCode) {
      const age = Date.now() - recentCode.createdAt.getTime()

      if (age < 30_000) {
        return NextResponse.json(
          {
            error: "Aguarde 30 segundos antes de gerar outro código.",
          },
          { status: 429 }
        )
      }
    }

    const code = randomInt(10_000_000, 100_000_000).toString()

    const codeHash = hashDeviceSecret(code)

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    )

    await prisma.$transaction(async (tx) => {
      await tx.nimoPairingCode.deleteMany({
        where: {
          deviceId: device.id,
          usedAt: null,
        },
      })

      await tx.nimoPairingCode.create({
        data: {
          deviceId: device.id,
          codeHash,
          expiresAt,
        },
      })
    })

    return NextResponse.json({
      code,
      expiresAt,
    })
  } catch (error) {
    console.error("[NIMO] Pairing request:", error)

    return NextResponse.json(
      { error: "Erro ao gerar código." },
      { status: 500 }
    )
  }
}