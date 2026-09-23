import { AuthGate } from "@/src/components/auth/AuthGate";
import { MobileShell } from "@/src/components/layout/MobileShell";
import type { ReactNode } from "react";

export default function EmployeeMobileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGate>
      <MobileShell>{children}</MobileShell>
    </AuthGate>
  );
}
