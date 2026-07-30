import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/lib/auth/dal";
import { SpotlightCard } from "@/components/ui/spotlight";

export const metadata: Metadata = {
  title: "Your studio · Rumiva",
};

export default async function StudioPage() {
  const account = await getCurrentAccount();

  // Valid session but the account no longer exists in the store.
  if (!account) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="font-heading text-3xl text-foreground">
          {account.name}
        </h1>
      </header>

      {/* Lit panels, so the workspace still has a surface — but no tilt: these
          are records to read, not objects to play with. */}
      <SpotlightCard className="rounded-2xl bg-background p-6">
        <h2 className="relative text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Account
        </h2>
        <dl className="relative mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Studio</dt>
            <dd className="text-sm text-foreground">{account.studioName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Email</dt>
            <dd className="text-sm text-foreground">{account.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Member since</dt>
            <dd className="text-sm text-foreground">
              {new Date(account.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </SpotlightCard>

      <SpotlightCard className="rounded-2xl border-dashed bg-background/50 p-6">
        <h2 className="relative font-heading text-lg text-foreground">
          Next steps
        </h2>
        <p className="relative mt-1.5 max-w-prose text-sm text-muted-foreground">
          Your portfolio, projects, and 3D case studies will live here. This is
          the onboarding home — the place to publish your studio to the public
          designer directory once portfolio editing lands.
        </p>
      </SpotlightCard>
    </div>
  );
}
