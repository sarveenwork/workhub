"use client";

import { AuthGate } from "@/src/components/auth/AuthGate";
import { AppShell } from "@/src/components/layout/AppShell";
import { authService } from "@/src/services/authService";
import { LoadingState } from "@/src/components/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

function EmployeeAdminRedirect({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      const role = authService.getSession()?.user.role;
      if (role === "employee") {
        router.replace("/m");
        return;
      }
      setOk(true);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ok) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Opening employee app…" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGate>
      <EmployeeAdminRedirect>
        <AppShell>{children}</AppShell>
      </EmployeeAdminRedirect>
    </AuthGate>
  );
}
