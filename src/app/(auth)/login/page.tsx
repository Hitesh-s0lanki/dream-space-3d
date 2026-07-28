import type { Metadata } from "next";

import { LoginForm } from "../_components/login-form";

export const metadata: Metadata = {
  title: "Log in · Rumiva for Designers",
  description: "Sign in to manage your Rumiva designer portfolio.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-2xl text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Log in to manage your studio portfolio.
        </p>
      </header>
      <LoginForm />
    </div>
  );
}
