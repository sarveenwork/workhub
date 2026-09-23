import { cn } from "@/src/lib/cn";
import type { ReactNode } from "react";
import { Card, CardHeader } from "./Card";

interface ChartCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader title={title} description={description} action={action} />
      <div className="h-64 w-full">{children}</div>
    </Card>
  );
}
