"use client";

import { cn } from "@/src/lib/cn";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "right" | "left";
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close drawer backdrop"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute top-0 flex h-full w-full max-w-md flex-col bg-card shadow-xl",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </div>
  );
}
