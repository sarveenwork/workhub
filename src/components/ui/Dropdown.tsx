"use client";

import { cn } from "@/src/lib/cn";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export function Dropdown({ trigger, children, align = "right" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative inline-flex" ref={ref}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open ? (
        <div
          className={cn(
            "absolute z-40 mt-1 min-w-44 rounded-md border border-border bg-card py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
          role="menu"
        >
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      ) : null}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  danger,
}: {
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center px-3 py-2 text-left text-sm hover:bg-muted",
        danger && "text-destructive",
      )}
    >
      {children}
    </button>
  );
}
