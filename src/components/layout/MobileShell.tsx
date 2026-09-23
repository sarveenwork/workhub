"use client";

import { cn } from "@/src/lib/cn";
import { employeeMobileService } from "@/src/services";
import type { Company } from "@/src/types";
import {
  CalendarDays,
  Fingerprint,
  Home,
  LogOut,
  MoreHorizontal,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const tabs = [
  { href: "/m", label: "Home", icon: Home, exact: true },
  { href: "/m/shifts", label: "Shifts", icon: CalendarDays },
  { href: "/m/check-in", label: "Check-in", icon: Fingerprint },
  { href: "/m/pay", label: "Pay", icon: Wallet },
  { href: "/m/more", label: "More", icon: MoreHorizontal },
];

function isTabActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.getCompany().then((c) => {
      if (!cancelled) setCompany(c);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-200/80 px-0 py-0 sm:px-4 sm:py-6">
      <div className="mx-auto flex max-w-lg flex-col gap-3 sm:max-w-[420px]">
        <div className="hidden items-center justify-between px-1 sm:flex">
          <div>
            <p className="text-sm font-semibold text-slate-800">Employee mobile</p>
            <p className="text-xs text-slate-500">
              Demo phone view · how workers use Workhub
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-teal-800 hover:underline"
          >
            Admin console →
          </Link>
        </div>

        <div
          className={cn(
            "relative flex min-h-screen flex-col overflow-hidden bg-[#f4f6f8] text-slate-900 sm:min-h-[760px] sm:rounded-[2rem] sm:border sm:border-slate-300 sm:shadow-xl",
          )}
        >
          <div className="mx-auto mt-2 hidden h-1.5 w-24 rounded-full bg-slate-300 sm:block" />

          <header className="flex items-center justify-between gap-2 border-b border-slate-200/80 bg-white px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-bold text-white">
                W
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-none">Workhub</p>
                <p className="mt-0.5 truncate text-[10px] text-slate-500">
                  {company?.name ?? "Loading company…"}
                </p>
              </div>
            </div>
            <Link
              href="/logout"
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              Out
            </Link>
          </header>

          <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">{children}</div>

          <nav className="absolute inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
            <ul className="grid grid-cols-5">
              {tabs.map((tab) => {
                const active = isTabActive(pathname, tab.href, tab.exact);
                const Icon = tab.icon;
                return (
                  <li key={tab.href}>
                    <Link
                      href={tab.href}
                      className={cn(
                        "flex flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-medium",
                        active ? "text-teal-800" : "text-slate-500",
                      )}
                    >
                      <Icon className={cn("h-5 w-5", active && "stroke-[2.25]")} />
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
