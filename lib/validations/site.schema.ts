import { z } from "zod"

export const createSiteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome precisa ter pelo menos 2 caracteres.")
    .max(60, "O nome pode ter no máximo 60 caracteres."),

  url: z
    .string()
    .trim()
    .url("Informe uma URL válida.")
    .refine((value) => {
      try {
        const url = new URL(value)

        return (
          ["http:", "https:"].includes(url.protocol) &&
          !url.username &&
          !url.password
        )
      } catch {
        return false
      }
    }, "Informe uma URL HTTP ou HTTPS válida."),
})

export type CreateSiteInput = z.infer<typeof createSiteSchema>