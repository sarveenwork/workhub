import type { Payroll, PayrollItem } from "@/src/types";
import { employees } from "./employees";
import { allowances } from "./allowances";

/**
 * MOCK payroll figures only.
 * Do not treat these as calculated statutory amounts.
 * Real calculation belongs in the future backend payroll engine.
 */
function mockItem(
  payrollId: string,
  employeeId: string,
  unpaidLeaveAmount = 0,
): PayrollItem {
  const emp = employees.find((e) => e.id === employeeId)!;
  const empAllowances = allowances
    .filter((a) => a.employeeId === employeeId && a.status === "active")
    .map((a) => ({ type: a.type, label: a.label, amount: a.amount }));

  const allowanceTotal = empAllowances.reduce((s, a) => s + a.amount, 0);
  const overtime = emp.isSecurityGuard
    ? 280
    : emp.overtimeRatePerShift
      ? emp.overtimeRatePerShift * 2
      : 0;
  const basicSalary = emp.basicSalary;
  const grossSalary = basicSalary + overtime + allowanceTotal;

  // Mock deduction amounts — NOT real EPF/SOCSO/EIS/PCB rates
  const epfEmployee = Math.round(basicSalary * 0.11);
  const socsoEmployee = 15;
  const eisEmployee = 5;
  const pcb = basicSalary > 3000 ? 80 : 0;

  const deductions = [
    { type: "epf" as const, label: "EPF (Employee)", amount: epfEmployee },
    { type: "socso" as const, label: "SOCSO (Employee)", amount: socsoEmployee },
    { type: "eis" as const, label: "EIS (Employee)", amount: eisEmployee },
    ...(pcb > 0
      ? [{ type: "pcb" as const, label: "Income Tax / PCB", amount: pcb }]
      : []),
    ...(unpaidLeaveAmount > 0
      ? [
          {
            type: "unpaid_leave" as const,
            label: "Unpaid Leave",
            amount: unpaidLeaveAmount,
          },
        ]
      : []),
  ];

  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const netSalary = grossSalary - totalDeductions;

  const epfEmployer = Math.round(basicSalary * 0.13);
  const socsoEmployer = 35;
  const eisEmployer = 5;

  const employerContributions = [
    {
      type: "epf" as const,
      label: "EPF (Employer)",
      employeeAmount: epfEmployee,
      employerAmount: epfEmployer,
    },
    {
      type: "socso" as const,
      label: "SOCSO (Employer)",
      employeeAmount: socsoEmployee,
      employerAmount: socsoEmployer,
    },
    {
      type: "eis" as const,
      label: "EIS (Employer)",
      employeeAmount: eisEmployee,
      employerAmount: eisEmployer,
    },
  ];

  const totalEmployerContributions = epfEmployer + socsoEmployer + eisEmployer;
  const employerCost = grossSalary + totalEmployerContributions;

  return {
    id: `${payrollId}-${employeeId}`,
    payrollId,
    employeeId,
    basicSalary,
    overtime,
    allowances: empAllowances,
    grossSalary,
    deductions,
    totalDeductions,
    netSalary,
    employerContributions,
    totalEmployerContributions,
    employerCost,
  };
}

const activeEmployees = employees.filter((e) => e.status !== "resigned");

function buildPayroll(
  id: string,
  year: number,
  month: number,
  status: Payroll["status"],
  generatedAt: string,
  approvedAt: string | null,
  paidAt: string | null,
  unpaidLeaveEmployees: Record<string, number> = {},
): Payroll {
  const resolved = activeEmployees.map((emp) =>
    mockItem(id, emp.id, unpaidLeaveEmployees[emp.id] ?? 0),
  );

  return {
    id,
    periodLabel: new Date(year, month - 1, 1).toLocaleString("en-MY", {
      month: "long",
      year: "numeric",
    }),
    year,
    month,
    status,
    employeeCount: resolved.length,
    totalGross: resolved.reduce((s, i) => s + i.grossSalary, 0),
    totalNet: resolved.reduce((s, i) => s + i.netSalary, 0),
    totalEmployerContributions: resolved.reduce(
      (s, i) => s + i.totalEmployerContributions,
      0,
    ),
    totalEmployerCost: resolved.reduce((s, i) => s + i.employerCost, 0),
    generatedAt,
    approvedAt,
    paidAt,
    items: resolved,
  };
}

export const payrolls: Payroll[] = [
  buildPayroll(
    "pay-2026-09",
    2026,
    9,
    "pending_review",
    "2026-09-20T10:00:00+08:00",
    null,
    null,
    { "emp-023": 100, "emp-015": 100 },
  ),
  buildPayroll(
    "pay-2026-08",
    2026,
    8,
    "paid",
    "2026-08-25T09:00:00+08:00",
    "2026-08-27T14:00:00+08:00",
    "2026-08-28T10:00:00+08:00",
  ),
  buildPayroll(
    "pay-2026-07",
    2026,
    7,
    "paid",
    "2026-07-25T09:00:00+08:00",
    "2026-07-27T11:00:00+08:00",
    "2026-07-28T10:00:00+08:00",
  ),
  buildPayroll(
    "pay-2026-06",
    2026,
    6,
    "paid",
    "2026-06-25T09:00:00+08:00",
    "2026-06-26T16:00:00+08:00",
    "2026-06-28T10:00:00+08:00",
  ),
  buildPayroll(
    "pay-2026-05",
    2026,
    5,
    "approved",
    "2026-05-24T09:00:00+08:00",
    "2026-05-26T10:00:00+08:00",
    null,
  ),
  buildPayroll(
    "pay-2026-04",
    2026,
    4,
    "draft",
    "2026-04-22T09:00:00+08:00",
    null,
    null,
  ),
];

export function getPayrollById(id: string): Payroll | undefined {
  return payrolls.find((p) => p.id === id);
}
