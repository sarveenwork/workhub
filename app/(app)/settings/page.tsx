"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { Alert, Card, CardHeader, LoadingState, Tabs, type TabItem } from "@/src/components/ui";
import { settingsService } from "@/src/services";
import type {
  AttendanceConfig,
  CompanySettings,
  ContributionConfig,
  PayrollConfig,
} from "@/src/types";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [tab, setTab] = useState("company");
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [payroll, setPayroll] = useState<PayrollConfig | null>(null);
  const [attendance, setAttendance] = useState<AttendanceConfig | null>(null);
  const [contrib, setContrib] = useState<ContributionConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [c, p, a, co] = await Promise.all([
        settingsService.getCompany(),
        settingsService.getPayrollConfig(),
        settingsService.getAttendanceConfig(),
        settingsService.getContributionConfig(),
      ]);
      if (cancelled) return;
      setCompany(c);
      setPayroll(p);
      setAttendance(a);
      setContrib(co);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !company || !payroll || !attendance || !contrib) {
    return <LoadingState />;
  }

  const tabs: TabItem[] = [
    {
      id: "company",
      label: "Company",
      content: (
        <Card>
          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <Field label="Company name" value={company.name} />
            <Field label="Registration" value={company.registrationNumber} />
            <Field label="Address" value={company.address} />
            <Field label="Phone" value={company.phone} />
            <Field label="Email" value={company.email} />
            <Field label="Currency" value={company.currency} />
            <Field label="Timezone" value={company.timezone} />
          </dl>
        </Card>
      ),
    },
    {
      id: "payroll",
      label: "Payroll configuration",
      content: (
        <Card>
          <Alert tone="warning" title="TO BE CONFIRMED" className="mb-4">
            {payroll.notes}
          </Alert>
          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <Field
              label="Cutoff day"
              value={payroll.cutoffDay?.toString() ?? "TO BE CONFIRMED"}
            />
            <Field
              label="Payment day"
              value={payroll.paymentDay?.toString() ?? "TO BE CONFIRMED"}
            />
            <Field
              label="Include SOCSO in employer cost"
              value={
                payroll.includeSocsoInEmployerCost == null
                  ? "TO BE CONFIRMED"
                  : String(payroll.includeSocsoInEmployerCost)
              }
            />
            <Field
              label="Include EIS in employer cost"
              value={
                payroll.includeEisInEmployerCost == null
                  ? "TO BE CONFIRMED"
                  : String(payroll.includeEisInEmployerCost)
              }
            />
          </dl>
        </Card>
      ),
    },
    {
      id: "attendance",
      label: "Attendance configuration",
      content: (
        <Card>
          <Alert tone="warning" title="TO BE CONFIRMED" className="mb-4">
            {attendance.notes}
          </Alert>
          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <Field label="Standard start" value={attendance.standardStartTime} />
            <Field label="Standard end" value={attendance.standardEndTime} />
            <Field
              label="Late grace (minutes)"
              value={
                attendance.lateGraceMinutes?.toString() ?? "TO BE CONFIRMED"
              }
            />
            <Field
              label="Working days / month"
              value={
                attendance.workingDaysPerMonth?.toString() ?? "TO BE CONFIRMED"
              }
            />
          </dl>
        </Card>
      ),
    },
    {
      id: "contributions",
      label: "Contribution configuration",
      content: (
        <Card>
          <Alert tone="warning" title="TO BE CONFIRMED" className="mb-4">
            {contrib.notes}
          </Alert>
          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <Field label="EPF employee rate" value="TO BE CONFIRMED" />
            <Field label="EPF employer rate" value="TO BE CONFIRMED" />
            <Field label="SOCSO employee rate" value="TO BE CONFIRMED" />
            <Field label="SOCSO employer rate" value="TO BE CONFIRMED" />
            <Field label="EIS employee rate" value="TO BE CONFIRMED" />
            <Field label="EIS employer rate" value="TO BE CONFIRMED" />
          </dl>
        </Card>
      ),
    },
    {
      id: "users",
      label: "Users & roles",
      content: (
        <Card>
          <CardHeader
            title="Permission-aware UI placeholders"
            description="Real authentication is not implemented in this demo."
          />
          <ul className="space-y-2 text-sm">
            <li className="rounded-md border border-border px-3 py-2">
              Deepa Krishnan — Administrator / HR
            </li>
            <li className="rounded-md border border-border px-3 py-2">
              Muhammad Hafiz — Manager (view employees, attendance, payroll summaries)
            </li>
            <li className="rounded-md border border-border px-3 py-2 text-muted-foreground">
              Employee self-service — future-ready
            </li>
          </ul>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Company and configuration screens. Uncertain values stay marked TO BE CONFIRMED."
      />
      <DemoBanner />
      <Tabs items={tabs} value={tab} onChange={setTab} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
