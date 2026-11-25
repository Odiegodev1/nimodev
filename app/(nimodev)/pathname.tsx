"use client"

import { usePathname } from "next/navigation"

export function UsePathName(){
    const pathname = usePathname()

    if (pathname === "/feedback" || pathname === "/") {
        return <p>Coletar feedback</p>;
      }
    
      if (pathname === "/resultado") {
        return <p>Resultado</p>;
      }
      if (pathname === "/sites") {
        return <p>Meus Sites</p>;
      }

    return null;
}