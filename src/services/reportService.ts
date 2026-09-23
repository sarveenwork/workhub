import { employees } from "@/src/mocks";
import { payrolls } from "@/src/mocks/payroll";
import type {
  ContributionListingRow,
  MonthlyPayrollSummaryRow,
  YearlyPayrollMonth,
} from "@/src/types";
import { mockRequest } from "./mockClient";

function monthName(month: number): string {
  return new Date(2026, month - 1, 1).toLocaleString("en-MY", { month: "long" });
}

export const reportService = {
  async monthlyPayrollSummary(payrollId: string): Promise<MonthlyPayrollSummaryRow[]> {
    const payroll = payrolls.find((p) => p.id === payrollId);
    if (!payroll) return mockRequest([]);

    const rows = payroll.items.map((item) => {
      const emp = employees.find((e) => e.id === item.employeeId)!;
      const epf = item.deductions.find((d) => d.type === "epf")?.amount ?? 0;
      const socso = item.deductions.find((d) => d.type === "socso")?.amount ?? 0;
      const eis = item.deductions.find((d) => d.type === "eis")?.amount ?? 0;
      const tax = item.deductions.find((d) => d.type === "pcb")?.amount ?? 0;
      const unpaidLeave = item.deductions.find((d) => d.type === "unpaid_leave")?.amount ?? 0;
      return {
        employeeId: emp.id,
        employeeName: emp.fullName,
        employeeCode: emp.employeeId,
        basicSalary: item.basicSalary,
        overtime: item.overtime,
        allowances: item.allowances.reduce((s, a) => s + a.amount, 0),
        grossSalary: item.grossSalary,
        epf,
        socso,
        eis,
        tax,
        unpaidLeave,
        netSalary: item.netSalary,
        employerCost: item.employerCost,
      };
    });

    return mockRequest(rows);
  },

  async yearlyPayrollSummary(
    employeeId: string,
    year: number,
  ): Promise<{ months: YearlyPayrollMonth[]; totals: YearlyPayrollMonth }> {
    const months: YearlyPayrollMonth[] = [];
    for (let m = 1; m <= 12; m++) {
      const payroll = payrolls.find((p) => p.year === year && p.month === m);
      const item = payroll?.items.find((i) => i.employeeId === employeeId);
      months.push({
        month: m,
        label: monthName(m),
        basicSalary: item?.basicSalary ?? 0,
        overtime: item?.overtime ?? 0,
        allowances: item?.allowances.reduce((s, a) => s + a.amount, 0) ?? 0,
        grossSalary: item?.grossSalary ?? 0,
        deductions: item?.totalDeductions ?? 0,
        netSalary: item?.netSalary ?? 0,
        employerCost: item?.employerCost ?? 0,
      });
    }

    const totals: YearlyPayrollMonth = {
      month: 0,
      label: "Year Total",
      basicSalary: months.reduce((s, m) => s + m.basicSalary, 0),
      overtime: months.reduce((s, m) => s + m.overtime, 0),
      allowances: months.reduce((s, m) => s + m.allowances, 0),
      grossSalary: months.reduce((s, m) => s + m.grossSalary, 0),
      deductions: months.reduce((s, m) => s + m.deductions, 0),
      netSalary: months.reduce((s, m) => s + m.netSalary, 0),
      employerCost: months.reduce((s, m) => s + m.employerCost, 0),
    };

    return mockRequest({ months, totals });
  },

  async epfListing(payrollId: string): Promise<ContributionListingRow[]> {
    const payroll = payrolls.find((p) => p.id === payrollId);
    if (!payroll) return mockRequest([]);
    return mockRequest(
      payroll.items.map((item) => {
        const emp = employees.find((e) => e.id === item.employeeId)!;
        const contrib = item.employerContributions.find((c) => c.type === "epf")!;
        return {
          employeeId: emp.id,
          employeeName: emp.fullName,
          employeeCode: emp.employeeId,
          employeeAmount: contrib.employeeAmount,
          employerAmount: contrib.employerAmount,
          total: contrib.employeeAmount + contrib.employerAmount,
        };
      }),
    );
  },

  async socsoEisListing(
    payrollId: string,
  ): Promise<{ socso: ContributionListingRow[]; eis: ContributionListingRow[] }> {
    const payroll = payrolls.find((p) => p.id === payrollId);
    if (!payroll) return mockRequest({ socso: [], eis: [] });

    const mapType = (type: "socso" | "eis"): ContributionListingRow[] =>
      payroll.items.map((item) => {
        const emp = employees.find((e) => e.id === item.employeeId)!;
        const contrib = item.employerContributions.find((c) => c.type === type)!;
        return {
          employeeId: emp.id,
          employeeName: emp.fullName,
          employeeCode: emp.employeeId,
          employeeAmount: contrib.employeeAmount,
          employerAmount: contrib.employerAmount,
          total: contrib.employeeAmount + contrib.employerAmount,
        };
      });

    return mockRequest({ socso: mapType("socso"), eis: mapType("eis") });
  },

  /** Demo client-side CSV export — not a real Excel engine. */
  exportCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
    const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join(
      "\n",
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
