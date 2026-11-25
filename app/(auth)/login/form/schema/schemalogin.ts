
import { z } from "zod";


export const schemaLogin = z.object({
gmail:z.string().min(1, "O email e obrigatorio").email(),
senha:z.string().min(8, "Use no mínimo 8 caracteres ").max(78, "limite de caracteres alcançado")
});


export type SchemaLogin = z.infer<typeof schemaLogin>;
