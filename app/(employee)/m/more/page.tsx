"use client";

import { Avatar, LoadingState } from "@/src/components/ui";
import { employeeMobileService } from "@/src/services";
import type { Employee } from "@/src/types";
import { ChevronRight, Palmtree } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployeeMorePage() {
  const [profile, setProfile] = useState<Employee | null>(null);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.getProfile().then((p) => {
      if (!cancelled) setProfile(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile) return <LoadingState />;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Avatar name={profile.fullName} size="lg" />
        <div>
          <p className="font-semibold">{profile.fullName}</p>
          <p className="text-xs text-slate-500">{profile.employeeId}</p>
          <p className="mt-1 text-xs text-slate-500">{profile.phone}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Link
          href="/m/leave"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
            <Palmtree className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold">Leave</span>
            <span className="block text-xs text-slate-500">
              View and apply for leave
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>
        <Link
          href="/m/leave/apply"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
        >
          <span className="flex-1 text-sm font-semibold">Apply leave</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>
        <Link
          href="/logout"
          className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-medium text-red-600 shadow-sm"
        >
          Sign out
        </Link>
      </div>

      <p className="text-center text-[11px] text-slate-400">
        Employee mobile demo · mock data only
      </p>
    </div>
  );
}
