import { Suspense } from "react"

import { auth } from "@/lib/auth"
import  prisma  from "@/lib/prisma"

import { redirect } from "next/navigation"
import { connection } from "next/server"

import { Skeleton } from "@/components/ui/skeleton"

import { SettingsContent } from "./components/SettingsContent"

async function SettingsData() {
  await connection()

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      image: true,
      nimoTheme: true,
      _count: {
        select: {
          devices: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <SettingsContent
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        nimoTheme: user.nimoTheme,
      }}
      totalDevices={user._count.devices}
    />
  )
}

function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />

        <Skeleton className="h-10 w-64" />

        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <Skeleton className="h-72 w-full rounded-2xl" />

      <Skeleton className="h-[460px] w-full rounded-2xl" />

      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsData />
    </Suspense>
  )
}