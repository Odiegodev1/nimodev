import { lookup } from "node:dns/promises"
import { isIP } from "node:net"

function isPublicIPv4(ip: string) {
  const parts = ip.split(".").map(Number)

  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return false
  }

  const [a, b, c] = parts

  if (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113)
  ) {
    return false
  }

  return true
}

function isPublicIPv6(ip: string) {
  const normalized = ip.toLowerCase()

  if (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    /^fe[89ab]/.test(normalized) ||
    normalized.startsWith("2001:db8:")
  ) {
    return false
  }

  if (normalized.startsWith("::ffff:")) {
    const embedded = normalized.slice(7)

    return isIP(embedded) === 4 && isPublicIPv4(embedded)
  }

  return true
}

export async function validatePublicUrl(value: string) {
  const url = new URL(value)

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error("URL não permitida.")
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "")

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new Error("Endereços internos não são permitidos.")
  }

  const addresses = await lookup(hostname, { all: true })

  if (
    addresses.length === 0 ||
    addresses.some(({ address, family }) =>
      family === 4
        ? !isPublicIPv4(address)
        : !isPublicIPv6(address)
    )
  ) {
    throw new Error("O endereço precisa apontar para uma rede pública.")
  }

  return url.toString()
}