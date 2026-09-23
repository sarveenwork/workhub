"use client";

import { Avatar, LoadingState } from "@/src/components/ui";
import { employeeMobileService } from "@/src/services";
import type { Company, Employee } from "@/src/types";
import { Building2, ChevronRight, Palmtree } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployeeMorePage() {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      employeeMobileService.getProfile(),
      employeeMobileService.getCompany(),
    ]).then(([p, c]) => {
      if (cancelled) return;
      setProfile(p);
      setCompany(c);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile || !company) return <LoadingState />;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar name={profile.fullName} size="lg" />
          <div className="min-w-0">
            <p className="font-semibold">{profile.fullName}</p>
            <p className="text-xs text-slate-500">{profile.employeeId}</p>
            <p className="mt-1 text-xs text-slate-500">{profile.phone}</p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-slate-50 px-3 py-3">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Company
            </p>
            <p className="text-sm font-semibold text-slate-900">{company.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {company.code} · {company.registrationNumber}
            </p>
            <p className="mt-1 text-xs text-slate-500">{company.address}</p>
          </div>
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
