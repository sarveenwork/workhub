"use client";

import { Button, Card, LoadingState } from "@/src/components/ui";
import { authService } from "@/src/services/authService";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const sessionName = authService.getSession()?.user.name ?? null;

    void authService.logout().then(() => {
      if (cancelled) return;
      setName(sessionName);
      setDone(true);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => {
      router.replace("/login");
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [done, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState label="Signing out…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-4">
      <Card className="w-full max-w-md text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          <LogOut className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">
          Signed out
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {name
            ? `${name}'s demo session has been cleared.`
            : "Your demo session has been cleared."}{" "}
          Redirecting to sign in…
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/login">
            <Button>Back to sign in</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
