"use client";

import Link from "next/link";
import { useActionState } from "react";

import { register } from "@/lib/auth/actions";
import type { RegisterState } from "@/lib/auth/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export function RegisterForm() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    register,
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
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Alex Rivera"
            defaultValue={state?.values?.name}
            aria-invalid={Boolean(state?.errors?.name)}
          />
          <FieldError>{state?.errors?.name?.[0]}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="studioName">Studio / brand name</FieldLabel>
          <Input
            id="studioName"
            name="studioName"
            autoComplete="organization"
            placeholder="Rivera Interiors"
            defaultValue={state?.values?.studioName}
            aria-invalid={Boolean(state?.errors?.studioName)}
          />
          <FieldError>{state?.errors?.studioName?.[0]}</FieldError>
        </Field>

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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={Boolean(state?.errors?.password)}
          />
          <FieldError errors={state?.errors?.password?.map((message) => ({ message }))} />
        </Field>

        <Button type="submit" disabled={pending} className="mt-1 w-full">
          {pending ? "Creating account…" : "Create designer account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
