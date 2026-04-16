import 'server-only'
import { createHmac, createHash } from 'crypto'

const SECRET = process.env.VIEW_COOKIE_SECRET!

/** Sign a visitor token so we can detect tampering */
export function signToken(token: string): string {
  const sig = createHmac('sha256', SECRET).update(token).digest('hex').slice(0, 16)
  return `${token}.${sig}`
}

/** Verify and extract the token. Returns null if invalid. */
export function verifyToken(signed: string): string | null {
  const dot = signed.lastIndexOf('.')
  if (dot === -1) return null
  const token = signed.slice(0, dot)
  const sig = signed.slice(dot + 1)
  const expected = createHmac('sha256', SECRET).update(token).digest('hex').slice(0, 16)
  if (sig !== expected) return null
  return token
}

/** Hash an IP address for dedup without storing raw IPs */
export function hashIP(ip: string): string {
  return createHash('sha256').update(ip + SECRET).digest('hex')
}
