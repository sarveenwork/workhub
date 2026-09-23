"use client";

import { Alert, Button, Input } from "@/src/components/ui";
import { DEMO_ACCOUNTS, authService } from "@/src/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("admin@workhub.demo");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const session = authService.getSession();
      const fallback =
        session?.user.role === "employee" ? "/m" : "/dashboard";
      const destination =
        next.startsWith("/") && next !== "/dashboard" ? next : fallback;
      router.replace(destination);
    }
  }, [next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await authService.login(email, password);
      const fallback =
        session.user.role === "employee" ? "/m" : "/dashboard";
      const destination =
        next && next !== "/dashboard" && next.startsWith("/")
          ? next
          : fallback;
      // If user picked a demo account and default next is dashboard, route by role
      const target =
        searchParams.get("next") == null || next === "/dashboard"
          ? fallback
          : destination;
      router.replace(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setLoading(false);
    }
  }

  function fillAccount(accountEmail: string, accountPassword: string) {
    setEmail(accountEmail);
    setPassword(accountPassword);
    setError(null);
  }

  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-[46%] overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(13,148,136,0.35), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, rgba(15,23,42,0.9), transparent 50%), linear-gradient(160deg, #0b1220 0%, #134e4a 55%, #0f172a 100%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-500 text-lg font-bold text-white">
              W
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-white">
                Workhub
              </p>
              <p className="text-sm text-teal-100/80">Workforce & Payroll</p>
            </div>
          </div>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
            Manage people, attendance and payroll in one place.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Frontend demo for Admin/HR workflows. Sign in with a demo account —
            no real authentication backend yet.
          </p>
        </div>
        <p className="relative text-xs text-slate-500">
          Workhub Demo Sdn Bhd · Mock session only
        </p>
      </aside>

      <main className="flex flex-1 flex-col justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 text-sm font-bold text-white">
                W
              </div>
              <p className="text-xl font-semibold tracking-tight">Workhub</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Sign in
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use a demo account to open the Admin/HR console.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error ? (
              <Alert tone="error" title="Could not sign in">
                {error}
              </Alert>
            ) : null}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Demo accounts
            </p>
            <ul className="mt-3 space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <li key={account.email}>
                  <button
                    type="button"
                    onClick={() => fillAccount(account.email, account.password)}
                    className="flex w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60"
                  >
                    <span>
                      <span className="font-medium">{account.user.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {account.email} · {authService.roleLabel(account.user.role)}
                        {account.user.role === "employee"
                          ? " · opens mobile app"
                          : ""}
                      </span>
                    </span>
                    <span className="text-xs text-primary">Use</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Password for all demo accounts: <code className="text-foreground">demo123</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
