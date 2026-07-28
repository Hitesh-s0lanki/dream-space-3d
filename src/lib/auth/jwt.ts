/**
 * Stateless session tokens — the pure crypto half of session management.
 *
 * This module deliberately imports ONLY `jose` (Edge-compatible) and touches no
 * cookies, filesystem, or `server-only` boundary. That keeps it importable from
 * both Server Components/Actions AND `src/proxy.ts`, which runs before render
 * and may be deployed to a CDN edge. Cookie + store access lives in the
 * sibling `session.ts` / `accounts.ts` modules, which are server-only.
 */
import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {
  /** Stable account id — the minimum needed to look the designer up later. */
  userId: string;
  /** Denormalised for cheap header/nav display without a store round-trip. */
  email: string;
  name: string;
  /** ISO string; also mirrored in the cookie's own `expires`. */
  expiresAt: string;
};

const secret = process.env.SESSION_SECRET;

if (!secret && process.env.NODE_ENV === "production") {
  throw new Error(
    "SESSION_SECRET is not set. Generate one with `openssl rand -base64 32`.",
  );
}

// Dev fallback so the app runs out of the box; production hard-fails above.
const encodedKey = new TextEncoder().encode(
  secret ?? "dev-only-insecure-session-secret-change-me",
);

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decryptSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    // Tampered, expired, or signed with an old secret — treat as logged out.
    return null;
  }
}
