/**
 * Designer account store.
 *
 * There is no database yet, so accounts persist to a JSON file under `.data/`
 * (git-ignored). This is the single seam for auth data — same pattern as the
 * public catalog accessors in `src/data/index.ts`. When a real store arrives,
 * only this file changes: swap the file reads/writes for DB calls and keep the
 * exported function signatures.
 *
 * Passwords are hashed with Node's built-in `scrypt` (salt + timing-safe
 * compare) so we take on no crypto dependency.
 */
import "server-only";
import { randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const scryptAsync = promisify(scrypt);

const DATA_DIR = path.join(process.cwd(), ".data");
const ACCOUNTS_FILE = path.join(DATA_DIR, "accounts.json");

/** A designer who has onboarded themselves via the auth flow. */
export type DesignerAccount = {
  id: string;
  name: string;
  studioName: string;
  email: string;
  /** `salt:derivedKey`, both hex. Never sent to the client. */
  passwordHash: string;
  createdAt: string;
};

/** The account shape safe to expose beyond the server (no password hash). */
export type PublicAccount = Omit<DesignerAccount, "passwordHash">;

export function toPublicAccount(account: DesignerAccount): PublicAccount {
  return {
    id: account.id,
    name: account.name,
    studioName: account.studioName,
    email: account.email,
    createdAt: account.createdAt,
  };
}

async function readAccounts(): Promise<DesignerAccount[]> {
  try {
    const raw = await readFile(ACCOUNTS_FILE, "utf8");
    return JSON.parse(raw) as DesignerAccount[];
  } catch (error) {
    // First run: no file yet.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeAccounts(accounts: DesignerAccount[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), "utf8");
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const keyBuffer = Buffer.from(key, "hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return (
    keyBuffer.length === derived.length && timingSafeEqual(keyBuffer, derived)
  );
}

export async function findAccountByEmail(
  email: string,
): Promise<DesignerAccount | undefined> {
  const accounts = await readAccounts();
  const normalized = email.trim().toLowerCase();
  return accounts.find((a) => a.email === normalized);
}

export async function findAccountById(
  id: string,
): Promise<DesignerAccount | undefined> {
  const accounts = await readAccounts();
  return accounts.find((a) => a.id === id);
}

export type CreateAccountInput = {
  name: string;
  studioName: string;
  email: string;
  password: string;
};

/**
 * Creates an account, or returns `{ error }` when the email is already taken.
 * Email is stored lowercased so lookups are case-insensitive.
 */
export async function createAccount(
  input: CreateAccountInput,
): Promise<{ account: DesignerAccount } | { error: "email_taken" }> {
  const accounts = await readAccounts();
  const email = input.email.trim().toLowerCase();

  if (accounts.some((a) => a.email === email)) {
    return { error: "email_taken" };
  }

  const account: DesignerAccount = {
    id: randomUUID(),
    name: input.name.trim(),
    studioName: input.studioName.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  await writeAccounts([...accounts, account]);
  return { account };
}

/** Returns the account when the password matches, otherwise `null`. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<DesignerAccount | null> {
  const account = await findAccountByEmail(email);
  if (!account) {
    // Hash anyway to keep timing roughly constant against email enumeration.
    await hashPassword(password);
    return null;
  }
  const ok = await verifyPassword(password, account.passwordHash);
  return ok ? account : null;
}
