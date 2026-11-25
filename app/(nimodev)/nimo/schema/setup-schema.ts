import { z } from "zod"

export const wifiSchema = z.object({
  ssid: z
    .string()
    .trim()
    .min(1, "Informe o nome da rede Wi-Fi.")
    .max(32, "O SSID deve ter no máximo 32 caracteres."),

  password: z
    .string()
    .max(63, "Senha muito longa."),
})

export const pairSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^NIMO-\d{8}$/,
      "Utilize o formato NIMO-12345678."
    ),
})

export const syncSchema = z.object({
  deviceName: z
    .string()
    .trim()
    .min(2, "Informe o nome do dispositivo.")
    .max(50, "Máximo de 50 caracteres."),

  siteId: z.string().min(1, "Selecione um site."),

  interval: z.enum(["30", "60", "120", "300"]),
})

export type WifiFormData = z.infer<typeof wifiSchema>
export type PairFormData = z.infer<typeof pairSchema>
export type SyncFormData = z.infer<typeof syncSchema>