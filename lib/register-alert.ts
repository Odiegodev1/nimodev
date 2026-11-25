import prisma from "@/lib/prisma";
import type {
  AlertType,
  AlertSeverity,
  AlertSource,
} from "@/lib/generated/prisma";

interface RegisterAlertProps {
  siteId: string;
  url: string;
  path?: string;
  statusCode?: number;
  responseTime?: number;
  method?: string;
  source: AlertSource;
}

function getAlertInfo(statusCode?: number): {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
} {
  switch (statusCode) {
    case 404:
      return {
        type: "HTTP_404",
        severity: "MEDIUM",
        title: "Página não encontrada",
        message: "Uma página retornou HTTP 404.",
      };

    case 500:
      return {
        type: "HTTP_500",
        severity: "HIGH",
        title: "Erro interno no servidor",
        message: "O servidor retornou HTTP 500.",
      };

    case 502:
      return {
        type: "HTTP_502",
        severity: "HIGH",
        title: "Bad Gateway",
        message: "O servidor retornou HTTP 502.",
      };

    case 503:
      return {
        type: "HTTP_503",
        severity: "CRITICAL",
        title: "Serviço indisponível",
        message: "O servidor retornou HTTP 503.",
      };

    case 504:
      return {
        type: "HTTP_504",
        severity: "HIGH",
        title: "Gateway Timeout",
        message: "O servidor demorou para responder.",
      };

    default:
      return {
        type: statusCode ? "HTTP_OTHER" : "SITE_DOWN",
        severity: !statusCode
          ? "CRITICAL"
          : statusCode >= 500
            ? "HIGH"
            : "MEDIUM",
        title: statusCode
          ? `Erro HTTP ${statusCode}`
          : "Site indisponível",
        message: statusCode
          ? `Uma requisição retornou HTTP ${statusCode}.`
          : "Não foi possível acessar o site monitorado.",
      };
  }
}

export async function registerAlert(data: RegisterAlertProps) {
  const info = getAlertInfo(data.statusCode);

  const existing = await prisma.alert.findFirst({
    where: {
      siteId: data.siteId,
      type: info.type,
      path: data.path ?? null,
      source: data.source,
      status: "ACTIVE",
    },
  });

  if (existing) {
    return prisma.alert.update({
      where: {
        id: existing.id,
      },
      data: {
        occurrences: {
          increment: 1,
        },
        lastSeenAt: new Date(),
        responseTime: data.responseTime,
        severity: info.severity,
        readAt: null,
      },
    });
  }

  return prisma.alert.create({
    data: {
      siteId: data.siteId,
      url: data.url,
      path: data.path,
      statusCode: data.statusCode,
      responseTime: data.responseTime,
      method: data.method,
      source: data.source,
      type: info.type,
      severity: info.severity,
      title: info.title,
      message: info.message,
      status: "ACTIVE",
    },
  });
}