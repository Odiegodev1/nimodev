import "server-only"

import { createHash, timingSafeEqual } from "node:crypto"
import prisma from "../prisma"

export function hashDeviceSecret(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function isValidDeviceSecret(
  provided: string,
  storedHash: string
) {
  const expected = Buffer.from(storedHash, "hex")
  const received = Buffer.from(
    hashDeviceSecret(provided),
    "hex"
  )

  return (
    expected.length === received.length &&
    timingSafeEqual(expected, received)
  )
}

export async function authenticateDevice(request: Request) {
  const authorization = request.headers.get("authorization")

  if (!authorization?.startsWith("Bearer ")) {
    return null
  }

  const secret = authorization.slice(7).trim()

  if (!/^[a-f0-9]{64}$/i.test(secret)) {
    return null
  }

  const secretHash = hashDeviceSecret(secret)

  return prisma.nimoDevice.findFirst({
    where: {
      secretHash,
    },
  })
}