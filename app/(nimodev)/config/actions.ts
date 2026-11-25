"use server"

import { auth, signOut } from "@/lib/auth"
import  prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const themeSchema = z.enum([
  "ORIGINAL",
  "OCEAN",
  "LAVENDER",
  "SUNSET",
  "ROSE",
  "ICE",
])

async function requireUser() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Não autorizado.")
  }

  return session.user.id
}

export async function updateProfile(name: string) {
  const userId = await requireUser()

  const validated = z
    .string()
    .trim()
    .min(2)
    .max(80)
    .safeParse(name)

  if (!validated.success) {
    return {
      success: false,
      error: "Informe um nome válido.",
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: validated.data,
    },
  })

  revalidatePath("/configuracoes")

  return { success: true }
}

export async function updateNimoTheme(theme: string) {
  const userId = await requireUser()

  const validated = themeSchema.safeParse(theme)

  if (!validated.success) {
    return {
      success: false,
      error: "Tema inválido.",
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      nimoTheme: validated.data,
    },
  })

  revalidatePath("/configuracoes")

  return { success: true }
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/login",
  })
}

export async function deleteAccount(confirmation: string) {
  const userId = await requireUser()

  if (confirmation !== "EXCLUIR") {
    return {
      success: false,
      error: "Confirmação inválida.",
    }
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  })

  await signOut({
    redirectTo: "/login",
  })
}