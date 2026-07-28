import type { Metadata } from "next";

import { RegisterForm } from "../_components/register-form";

export const metadata: Metadata = {
  title: "Onboard your studio · Rumiva for Designers",
  description:
    "Create a Rumiva designer account and start building your portfolio.",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-2xl text-foreground">
          Onboard your studio
        </h1>
        <p className="text-sm text-muted-foreground">
          Create an account to publish your work on Rumiva.
        </p>
      </header>
      <RegisterForm />
    </div>
  );
}
