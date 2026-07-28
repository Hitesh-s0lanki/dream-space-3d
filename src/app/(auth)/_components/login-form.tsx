"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login } from "@/lib/auth/actions";
import type { LoginState } from "@/lib/auth/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <form action={action} noValidate>
      <FieldGroup>
        {state?.message ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {state.message}
          </p>
        ) : null}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@studio.com"
            defaultValue={state?.values?.email}
            aria-invalid={Boolean(state?.errors?.email)}
          />
          <FieldError>{state?.errors?.email?.[0]}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(state?.errors?.password)}
          />
          <FieldError>{state?.errors?.password?.[0]}</FieldError>
        </Field>

        <Button type="submit" disabled={pending} className="mt-1 w-full">
          {pending ? "Signing in…" : "Log in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Onboard your studio
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
