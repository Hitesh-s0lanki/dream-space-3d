/**
 * Auth server actions — the only entry points the client forms call. Each
 * validates on the server, talks to the account store, then manages the session
 * cookie. Treated as public POST endpoints, so all trust decisions live here.
 */
"use server";

import { redirect } from "next/navigation";
import * as z from "zod";

import { createAccount, verifyCredentials } from "./accounts";
import { createSession, deleteSession } from "./session";
import {
  LoginSchema,
  RegisterSchema,
  type LoginState,
  type RegisterState,
} from "./schemas";

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    studioName: String(formData.get("studioName") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const parsed = RegisterSchema.safeParse({
    ...values,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const result = await createAccount(parsed.data);

  if ("error" in result) {
    return {
      message: "An account with that email already exists. Try logging in.",
      values,
    };
  }

  await createSession({
    userId: result.account.id,
    email: result.account.email,
    name: result.account.name,
  });

  // Onboarding complete — land in the studio.
  redirect("/studio");
}

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const values = { email: String(formData.get("email") ?? "") };

  const parsed = LoginSchema.safeParse({
    email: values.email,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const account = await verifyCredentials(
    parsed.data.email,
    parsed.data.password,
  );

  if (!account) {
    // Deliberately vague — don't reveal whether the email exists.
    return { message: "Incorrect email or password.", values };
  }

  await createSession({
    userId: account.id,
    email: account.email,
    name: account.name,
  });

  redirect("/studio");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
