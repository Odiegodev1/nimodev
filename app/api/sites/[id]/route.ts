import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"



interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(
  _request: Request,
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

    const result = await prisma.monitoredSite.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Site não encontrado." },
        { status: 404 }
      )
    }

    console.log("[NIMO] Site excluído:", {
      siteId: id,
      userId: session.user.id,
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("[NIMO] Erro ao excluir:", error)

    return NextResponse.json(
      { error: "Erro interno ao excluir site." },
      { status: 500 }
    )
  }
}