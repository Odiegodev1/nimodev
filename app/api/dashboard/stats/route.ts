import { NextResponse } from "next/server"
import { connection } from "next/server"

import { auth } from "@/lib/auth"
import { getDashboardStats } from "@/lib/get-stats"

export async function GET() {
  try {
    await connection()

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Não autorizado.",
        },
        {
          status: 401,
        }
      )
    }

    const stats = await getDashboardStats(
      session.user.id
    )

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control":
          "private, no-store, max-age=0, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[NIMO] Dashboard stats:", error)

    return NextResponse.json(
      {
        error: "Não foi possível carregar as estatísticas.",
      },
      {
        status: 500,
      }
    )
  }
}