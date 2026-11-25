import { NextResponse, connection } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await connection();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    const alerts = await prisma.alert.findMany({
      where: {
        site: {
          userId: session.user.id,
        },
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
      },
      orderBy: {
        lastSeenAt: "desc",
      },
      take: 100,
    });

    const active = alerts.filter(
      (alert) => alert.status === "ACTIVE"
    );

    return NextResponse.json(
      {
        alerts,
        stats: {
          total: alerts.length,
          active: active.length,
          critical: active.filter(
            (alert) => alert.severity === "CRITICAL"
          ).length,
          unread: alerts.filter(
            (alert) => !alert.readAt
          ).length,
        },
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("[NIMO ALERTS]", error);

    return NextResponse.json(
      { error: "Erro ao buscar alertas." },
      { status: 500 }
    );
  }
}