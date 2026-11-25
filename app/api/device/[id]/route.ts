import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

interface RouteContext {
  params: Promise<{ id: string }>
}

const updateSchema = z.object({
  name: z.string().trim().min(2).max(60),
  siteId: z.string().min(1),
  syncInterval: z.number().int().min(30).max(3600),
})

export async function PATCH(
  request: Request,
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

    const parsed = updateSchema.safeParse(await request.json())

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Configurações inválidas." },
        { status: 400 }
      )
    }

    const site = await prisma.monitoredSite.findFirst({
      where: {
        id: parsed.data.siteId,
        userId: session.user.id,
      },
    })

    if (!site) {
      return NextResponse.json(
        { error: "Site não encontrado." },
        { status: 404 }
      )
    }

    const result = await prisma.nimoDevice.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name: parsed.data.name,
        siteId: site.id,
        syncInterval: parsed.data.syncInterval,
      },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Dispositivo não encontrado." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("[NIMO] Update device:", error)

    return NextResponse.json(
      { error: "Erro ao atualizar dispositivo." },
      { status: 500 }
    )
  }
}