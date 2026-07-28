/**
 * Session cookie management — the server-only half that touches `cookies()`.
 *
 * Mirrors the recommended cookie options from the Next.js authentication guide
 * (HttpOnly, Secure in prod, SameSite=lax, 7-day expiry). Pairs with the
 * Edge-safe token crypto in `./jwt`.
 */
import "server-only";
import { cookies } from "next/headers";

import { decryptSession, encryptSession, type SessionPayload } from "./jwt";

const COOKIE_NAME = "session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(
  user: Pick<SessionPayload, "userId" | "email" | "name">,
): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);
  const token = await encryptSession({
    ...user,
    expiresAt: expiresAt.toISOString(),
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(COOKIE_NAME)?.value);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
