/**
 * Data Access Layer — the single place that verifies the session close to the
 * data, per the Next.js auth guide. `proxy.ts` does an optimistic cookie-only
 * check for fast redirects; these functions are the real gate used by pages and
 * actions. `cache()` memoizes the lookup within a single render pass.
 */
import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";

import { getSession } from "./session";
import {
  findAccountById,
  toPublicAccount,
  type PublicAccount,
} from "./accounts";

/** Returns the session payload, or redirects to /login when unauthenticated. */
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login");
  }
  return { userId: session.userId };
});

/**
 * The authenticated designer's account (no password hash), or `null`. Redirects
 * to /login if there's no valid session. If the cookie is valid but the account
 * no longer exists in the store, this returns null rather than a stale profile.
 */
export const getCurrentAccount = cache(
  async (): Promise<PublicAccount | null> => {
    const { userId } = await verifySession();
    const account = await findAccountById(userId);
    return account ? toPublicAccount(account) : null;
  },
);

/** Non-redirecting read for optional UI (e.g. header): null when logged out. */
export const getOptionalAccount = cache(
  async (): Promise<PublicAccount | null> => {
    const session = await getSession();
    if (!session?.userId) return null;
    const account = await findAccountById(session.userId);
    return account ? toPublicAccount(account) : null;
  },
);
