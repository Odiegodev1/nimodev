import { z } from "zod"

const checkResponseSchema = z.object({
  status: z.enum(["ONLINE", "OFFLINE"]),
  httpStatus: z.number().int().nullable().optional(),
  responseTime: z.number().nonnegative().nullable().optional(),
  visitorsOnline: z.number().int().nonnegative().nullable().optional(),
  checkedAt: z.string().datetime().optional(),
  error: z.string().nullable().optional(),
})

export type MonitorResult = z.infer<typeof checkResponseSchema>

export async function checkSite(url: string): Promise<MonitorResult> {
  const apiUrl = process.env.MONITOR_CHECK_API_URL

  if (!apiUrl) {
    throw new Error("MONITOR_CHECK_API_URL não configurada.")
  }

  const endpoint = new URL(apiUrl)

  endpoint.searchParams.set("url", url)

  const response = await fetch(endpoint, {
    method: "GET",
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(
      `API de monitoramento retornou HTTP ${response.status}.`
    )
  }

  const body = await response.text()

  if (body.length > 20_000) {
    throw new Error("Resposta da API excedeu o tamanho permitido.")
  }

  const data = checkResponseSchema.safeParse(JSON.parse(body))

  if (!data.success) {
    throw new Error("Resposta inválida da API de monitoramento.")
  }

  return data.data
}