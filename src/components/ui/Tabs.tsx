"use client";

import { cn } from "@/src/lib/cn";
import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  const active = items.find((i) => i.id === value) ?? items[0];

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto border-b border-border"
      >
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={item.id === active.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              item.id === active.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-5">
        {active?.content}
      </div>
    </div>
  );
}
