import { NextResponse } from "next/server"
import { z } from "zod"

import prisma from "@/lib/prisma"
import { hashDeviceSecret } from "@/lib/nimo/device-auth"



const schema = z.object({
  hardwareId: z
    .string()
    .min(8)
    .max(100)
    .regex(/^[a-zA-Z0-9:_-]+$/),

  secret: z.string().regex(/^[a-f0-9]{64}$/i),

  firmwareVersion: z.string().max(30).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      )
    }

    const { hardwareId, secret, firmwareVersion } = parsed.data

    const secretHash = hashDeviceSecret(secret)

    const existing = await prisma.nimoDevice.findUnique({
      where: { hardwareId },
    })

    if (existing) {
      if (existing.secretHash !== secretHash) {
        return NextResponse.json(
          { error: "Dispositivo já registrado." },
          { status: 409 }
        )
      }

      return NextResponse.json({
        deviceId: existing.id,
        paired: Boolean(existing.userId),
      })
    }

    const device = await prisma.nimoDevice.create({
      data: {
        hardwareId,
        secretHash,
        firmwareVersion,
      },
    })

    return NextResponse.json(
      {
        deviceId: device.id,
        paired: false,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[NIMO] Bootstrap:", error)

    return NextResponse.json(
      { error: "Erro ao registrar dispositivo." },
      { status: 500 }
    )
  }
}