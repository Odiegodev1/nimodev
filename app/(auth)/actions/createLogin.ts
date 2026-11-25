"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { SchemaLogin } from "../login/form/schema/schemalogin";

type LoginResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function CreateUser(
  data: SchemaLogin
): Promise<LoginResult> {
  try {
    await signIn("credentials", {
      email: data.gmail.trim().toLowerCase(),
      password: data.senha,
      redirect: false,
    });

    return {
      success: true,
      message: "Login realizado com sucesso!",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          success: false,
          error: "E-mail ou senha incorretos.",
        };
      }

      return {
        success: false,
        error: "Não foi possível autenticar sua conta.",
      };
    }

    console.error("Erro inesperado no login:", error);

    return {
      success: false,
      error: "Erro interno no servidor.",
    };
  }
}