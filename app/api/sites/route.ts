import { NextRequest, NextResponse } from "next/server"


import { createSiteSchema } from "@/lib/validations/site.schema"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      )
    }

    const sites = await prisma.monitoredSite.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ sites })
  } catch (error) {
    console.error("[NIMO] Erro ao listar sites:", error)

    return NextResponse.json(
      { error: "Erro interno ao listar sites." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = createSiteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { name, url } = parsed.data
    const normalizedUrl = new URL(url).toString()

    const existing = await prisma.monitoredSite.findUnique({
      where: {
        userId_url: {
          userId: session.user.id,
          url: normalizedUrl,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Este site já está cadastrado." },
        { status: 409 }
      )
    }

    const site = await prisma.monitoredSite.create({
      data: {
        name,
        url: normalizedUrl,
        userId: session.user.id,
      },
    })

    console.log("[NIMO] Site cadastrado:", {
      siteId: site.id,
      userId: session.user.id,
      url: site.url,
    })

    return NextResponse.json(
      { site },
      { status: 201 }
    )
  } catch (error) {
    console.error("[NIMO] Erro ao cadastrar site:", error)

    return NextResponse.json(
      { error: "Erro interno ao cadastrar site." },
      { status: 500 }
    )
  }
}