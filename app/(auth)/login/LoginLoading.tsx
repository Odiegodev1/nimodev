import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";


 export   async function LoginLoading() {
        await connection();
      
        const session = await auth();
      
        if (session?.user) {
          redirect("/");
        }
      
        return null;
      }
