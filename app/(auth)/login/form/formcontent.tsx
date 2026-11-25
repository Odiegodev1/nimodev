"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOffIcon,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sidebar,
} from "lucide-react";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { schemaLogin, SchemaLogin } from "./schema/schemalogin";
import { CreateUser } from "../../actions/createLogin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export function FormContent() {
  const [showPassword, setShowPassword] = useState(false);
const router = useRouter()
  const form = useForm<SchemaLogin>({
    resolver: zodResolver(schemaLogin),
    defaultValues: {
      gmail: "",
      senha: "",
    },
  });

  // O próprio React Hook Form gerencia o estado de envio automaticamente
  const { isSubmitting } = form.formState;

  async function onSubmit(data: SchemaLogin) {
    try {
      const response = await CreateUser(data);
  
      if (!response.success) {
        toast.error(response.error);
        return;
      }
  
      toast.success(response.message);
  
      form.reset();
  
      router.replace("/dashboard");
      router.refresh();
    } catch {
      toast.error("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
      <div className="w-full max-w-[410px]">
        {/* Ícone */}
        <div className="mb-9 flex size-12 items-center justify-center rounded-2xl border border-[#e2e8df] bg-white shadow-sm">
          <LockKeyhole size={21} strokeWidth={1.7} className="text-[#567b39]" />
        </div>

        {/* Título */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#86bb4c]" />
            <span className="text-[11px] font-semibold tracking-[0.17em] text-[#7a8976] uppercase">
              Bem-vindo de volta
            </span>
          </div>

          <h2 className="text-[36px] leading-tight font-semibold tracking-[-1.8px] sm:text-[42px]">
            Entre na sua conta<span className="text-[#8bbf50]">.</span>
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#899288]">
            Acesse seu painel e continue de onde parou.
            <br className="hidden sm:block" />
            Seu NIMO está esperando por você.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-5">
          <FieldGroup>
            {/* Campo E-mail */}
            <Controller
              name="gmail"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">E-mail</FieldLabel>

                  <InputGroup className="group h-12 rounded-xl">
                    <InputGroupInput
                      {...field}
                      id="login-email"
                      type="email"
                      disabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                      placeholder="seu@mail.com"
                      autoComplete="email"
                    />
                    <InputGroupAddon className="text-muted-foreground transition-colors group-focus-within:text-lima">
                      <Mail />
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Campo Senha */}
            <Controller
              name="senha"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="login-password"
                    className="flex items-center justify-between"
                  >
                    <span>Senha</span>
                    <Link
                      href="/recuperar-senha"
                      className="text-xs font-medium text-[#60883e] transition hover:text-[#354f26]"
                    >
                      Esqueceu a senha?
                    </Link>
                  </FieldLabel>

                  <InputGroup className="group h-12 rounded-xl">
                    <InputGroupInput
                      {...field}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      disabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••••"
                      autoComplete="current-password"
                    />
                    <InputGroupAddon className="text-muted-foreground transition-colors group-focus-within:text-lima">
                      <LockKeyhole />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
                      >
                        {showPassword ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOffIcon className="size-4" />
                        )}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#b8f36b] text-sm font-bold text-[#1c2b15] shadow-[0_5px_20px_#b8f36b30] transition-all hover:-translate-y-0.5 hover:bg-[#a7e65b] hover:shadow-[0_8px_25px_#b8f36b40] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-[#263b20]/20 border-t-[#263b20]" />
                Entrando...
              </>
            ) : (
              <>
                Entrar na plataforma
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* Divisor */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#e3e9e0]" />
          <span className="text-[11px] text-[#a0aaa0]">ou continue com</span>
          <div className="h-px flex-1 bg-[#e3e9e0]" />
        </div>

        {/* Botão GitHub */}
        <button
          type="button"
          disabled={isSubmitting}
          className="flex h-[52px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#e1e7df] bg-white text-sm font-semibold text-[#303b30] transition hover:border-[#c3d0bd] hover:bg-[#f6f9f4] disabled:pointer-events-none disabled:opacity-60"
        >
          <Sidebar size={19} />
          Continuar com GitHub
        </button>

        {/* Cadastro mobile */}
        <p className="mt-9 text-center text-sm text-[#8a9389] lg:hidden">
          Ainda não tem uma conta?{" "}
          <Link href="/cadastro" className="font-semibold text-[#5e893d]">
            Criar conta
          </Link>
        </p>

        {/* Rodapé Segurança */}
        <div className="mt-10 flex items-center justify-center gap-2 text-[11px] text-[#a1aaa0]">
          <ShieldCheck size={15} />
          Sua conta e seus dispositivos em um só lugar.
        </div>
      </div>
    </div>
  );
}
