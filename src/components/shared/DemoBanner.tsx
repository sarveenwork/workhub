import { DEMO_BANNER } from "@/src/lib/constants";
import { Alert } from "@/src/components/ui";

export function DemoBanner({ className }: { className?: string }) {
  return (
    <Alert tone="warning" className={className}>
      {DEMO_BANNER}
    </Alert>
  );
}
