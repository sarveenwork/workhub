"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { Card } from "@/src/components/ui";
import {
  FileSpreadsheet,
  FileText,
  Shield,
  Wallet,
  CalendarRange,
} from "lucide-react";
import Link from "next/link";

const reports = [
  {
    href: "/reports/payroll-summary",
    title: "Monthly Payroll Summary",
    description: "Employee-level earnings, deductions, net and employer cost.",
    icon: Wallet,
  },
  {
    href: "/reports/yearly",
    title: "Individual Yearly Payroll Summary",
    description: "Select an employee and year for monthly breakdown.",
    icon: CalendarRange,
  },
  {
    href: "/reports/epf",
    title: "EPF Contribution Listing",
    description: "Monthly employee and employer EPF amounts (mock).",
    icon: Shield,
  },
  {
    href: "/reports/socso-eis",
    title: "SOCSO / EIS Contribution Listing",
    description: "Monthly SOCSO and EIS contribution listings (mock).",
    icon: FileSpreadsheet,
  },
  {
    href: "/reports/ea-form",
    title: "EA Form",
    description: "Future-ready statutory form — preview / coming soon.",
    icon: FileText,
  },
];

export default function ReportsIndexPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Payroll and statutory contribution reports for the demo."
      />
      <DemoBanner />
      <div className="grid gap-3 md:grid-cols-2">
        {reports.map((report) => (
          <Link key={report.href} href={report.href}>
            <Card className="h-full transition-colors hover:bg-muted/40">
              <div className="flex gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-800">
                  <report.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{report.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
