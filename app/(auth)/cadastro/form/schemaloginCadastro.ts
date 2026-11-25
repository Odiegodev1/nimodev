
import { z } from "zod";


export const schemaCadastro = z.object({
name:z.string().min(1, "O nome e obrigatorio"),
gmail:z.string().min(1, "O email e obrigatorio").email(),
senha:z.string().min(8, "Use no mínimo 8 caracteres ").max(78, "limite de caracteres alcançado")
});


export type SchemaCadastro = z.infer<typeof schemaCadastro>;
