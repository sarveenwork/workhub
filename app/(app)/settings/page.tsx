"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import {
  Alert,
  Badge,
  Card,
  CardHeader,
  LoadingState,
  Tabs,
  type TabItem,
} from "@/src/components/ui";
import { formatDateTime } from "@/src/lib/format";
import { authService, companyService, settingsService } from "@/src/services";
import type {
  AttendanceConfig,
  CompanySettings,
  CompanyUser,
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
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      settingsService.getCompany(),
      settingsService.getPayrollConfig(),
      settingsService.getAttendanceConfig(),
      settingsService.getContributionConfig(),
      companyService.listUsers(),
    ]).then(([c, p, a, co, u]) => {
      if (cancelled) return;
      setCompany(c);
      setPayroll(p);
      setAttendance(a);
      setContrib(co);
      setUsers(u);
      setLoading(false);
    });
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
          <Alert tone="info" className="mb-4">
            You are managing <strong>{company.name}</strong>. Use the company
            switcher in the header to change organisation.
          </Alert>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
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
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
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
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
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
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
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
            title={`Users for ${company.name}`}
            description="Roles for this company only. Switch company in the header to manage another organisation."
          />
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex flex-col gap-2 rounded-md border border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                  {u.lastActiveAt ? (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Last active {formatDateTime(u.lastActiveAt)}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Never signed in
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="primary">{authService.roleLabel(u.role)}</Badge>
                  <Badge
                    tone={
                      u.status === "active"
                        ? "success"
                        : u.status === "invited"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {u.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description={`${company.name} — configuration for the active company.`}
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
