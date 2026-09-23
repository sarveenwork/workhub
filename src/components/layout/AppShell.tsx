"use client";

import { Avatar, Badge, Button, Dropdown, DropdownItem } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import {
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Smartphone,
  Users,
  Wallet,
  X,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { notificationService } from "@/src/services";
import { authService } from "@/src/services/authService";
import type { User } from "@/src/types";

type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const nav: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Check-in (admin)", href: "/check-in", icon: <Fingerprint className="h-4 w-4" /> },
      { label: "Employee mobile", href: "/m", icon: <Smartphone className="h-4 w-4" /> },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Employees", href: "/employees", icon: <Users className="h-4 w-4" /> },
      { label: "Departments", href: "/people/departments", icon: <Building2 className="h-4 w-4" /> },
      { label: "Positions", href: "/people/positions", icon: <Briefcase className="h-4 w-4" /> },
    ],
  },
  {
    title: "Attendance",
    items: [
      { label: "Today", href: "/attendance/today", icon: <CalendarDays className="h-4 w-4" /> },
      { label: "Attendance Records", href: "/attendance", icon: <ClipboardList className="h-4 w-4" /> },
      { label: "Check-in approvals", href: "/attendance/check-ins", icon: <Fingerprint className="h-4 w-4" /> },
      { label: "Leave", href: "/attendance/leave", icon: <CalendarDays className="h-4 w-4" /> },
    ],
  },
  {
    title: "Payroll",
    items: [
      { label: "Payroll Overview", href: "/payroll", icon: <Wallet className="h-4 w-4" /> },
      { label: "Monthly Payroll", href: "/payroll/monthly", icon: <Wallet className="h-4 w-4" /> },
      { label: "Payroll History", href: "/payroll/history", icon: <Wallet className="h-4 w-4" /> },
    ],
  },
  {
    title: "Reports",
    items: [
      { label: "Payroll Summary", href: "/reports/payroll-summary" },
      { label: "EPF", href: "/reports/epf" },
      { label: "SOCSO / EIS", href: "/reports/socso-eis" },
      { label: "Yearly Summary", href: "/reports/yearly" },
      { label: "EA Form", href: "/reports/ea-form" },
      { label: "All Reports", href: "/reports", icon: <FileSpreadsheet className="h-4 w-4" /> },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Notifications", href: "/notifications", icon: <Bell className="h-4 w-4" /> },
      { label: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/employees") return pathname.startsWith("/employees");
  if (href === "/attendance") return pathname === "/attendance";
  if (href === "/payroll") return pathname === "/payroll";
  if (href === "/reports") return pathname === "/reports";
  if (href === "/settings") return pathname.startsWith("/settings");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {nav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-white"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-white",
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    void notificationService.unreadCount().then((count) => {
      if (!cancelled) setUnread(count);
    });
    void Promise.resolve().then(() => {
      if (!cancelled) setUser(authService.getSession()?.user ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const roleTitle =
    user?.role === "manager"
      ? "Manager Console"
      : user?.role === "employee"
        ? "Employee Console"
        : "Admin / HR Console";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-600 text-sm font-bold text-white">
            W
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Workhub</p>
            <p className="text-[10px] text-sidebar-muted">Workforce & Payroll</p>
          </div>
        </div>
        <SidebarNav />
        <div className="border-t border-sidebar-border p-3">
          <p className="px-2 text-[10px] text-sidebar-muted">Frontend demo · mock data</p>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-sidebar shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
              <p className="text-sm font-semibold text-white">Workhub</p>
              <Button variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{roleTitle}</p>
              <p className="text-xs text-muted-foreground">Workhub Demo Sdn Bhd</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                Notifications
                {unread > 0 ? (
                  <Badge tone="danger" className="ml-1">
                    {unread}
                  </Badge>
                ) : null}
              </Button>
            </Link>
            <Dropdown
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md border border-border px-2 py-1 hover:bg-muted/50"
                >
                  <Avatar name={user?.name ?? "User"} size="sm" />
                  <div className="hidden text-left md:block">
                    <p className="text-xs font-medium leading-none">
                      {user?.name ?? "…"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {user ? authService.roleLabel(user.role) : "…"}
                    </p>
                  </div>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
                </button>
              }
            >
              <DropdownItem onClick={() => router.push("/settings")}>
                Settings
              </DropdownItem>
              <DropdownItem onClick={() => router.push("/logout")} danger>
                <span className="inline-flex items-center gap-2">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </span>
              </DropdownItem>
            </Dropdown>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
