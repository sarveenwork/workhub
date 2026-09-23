import { DEMO_TODAY } from "@/src/lib/constants";
import {
  employeeShifts,
  getTodayShift,
  leaveRequests,
  MOBILE_EMPLOYEE_ID,
} from "@/src/mocks/employeeMobile";
import { employees } from "@/src/mocks/employees";
import { payrolls } from "@/src/mocks/payroll";
import type {
  ContributionListingRow,
  Employee,
  LeaveRequest,
  LeaveType,
  PayrollItem,
  Shift,
  YearlyPayrollMonth,
} from "@/src/types";
import { mockRequest } from "./mockClient";
import { reportService } from "./reportService";

function monthName(month: number): string {
  return new Date(2026, month - 1, 1).toLocaleString("en-MY", { month: "long" });
}

export const employeeMobileService = {
  employeeId: MOBILE_EMPLOYEE_ID,

  async getProfile(): Promise<Employee> {
    const emp = employees.find((e) => e.id === MOBILE_EMPLOYEE_ID)!;
    return mockRequest(emp);
  },

  async getTodayShift(date = DEMO_TODAY): Promise<Shift | null> {
    return mockRequest(getTodayShift(date) ?? null);
  },

  async getWeekShifts(): Promise<Shift[]> {
    return mockRequest([...employeeShifts].sort((a, b) => a.date.localeCompare(b.date)));
  },

  async getLatestPayslip(): Promise<{
    periodLabel: string;
    payrollId: string;
    item: PayrollItem;
  } | null> {
    const paid = [...payrolls]
      .filter((p) => p.status === "paid" || p.status === "approved" || p.status === "pending_review")
      .sort((a, b) => b.year - a.year || b.month - a.month);
    for (const p of paid) {
      const item = p.items.find((i) => i.employeeId === MOBILE_EMPLOYEE_ID);
      if (item) {
        return mockRequest({
          periodLabel: p.periodLabel,
          payrollId: p.id,
          item,
        });
      }
    }
    return mockRequest(null);
  },

  async getMonthlyPayslip(payrollId: string): Promise<{
    periodLabel: string;
    item: PayrollItem;
  } | null> {
    const p = payrolls.find((x) => x.id === payrollId);
    const item = p?.items.find((i) => i.employeeId === MOBILE_EMPLOYEE_ID);
    if (!p || !item) return mockRequest(null);
    return mockRequest({ periodLabel: p.periodLabel, item });
  },

  async listPayrollPeriods(): Promise<{ id: string; label: string; status: string }[]> {
    const list = payrolls
      .filter((p) => p.items.some((i) => i.employeeId === MOBILE_EMPLOYEE_ID))
      .map((p) => ({ id: p.id, label: p.periodLabel, status: p.status }));
    return mockRequest(list);
  },

  async getYearlySummary(year: number): Promise<{
    months: YearlyPayrollMonth[];
    totals: YearlyPayrollMonth;
  }> {
    return reportService.yearlyPayrollSummary(MOBILE_EMPLOYEE_ID, year);
  },

  async getEpf(payrollId: string): Promise<ContributionListingRow | null> {
    const rows = await reportService.epfListing(payrollId);
    return mockRequest(rows.find((r) => r.employeeId === MOBILE_EMPLOYEE_ID) ?? null);
  },

  async getSocsoEis(payrollId: string): Promise<{
    socso: ContributionListingRow | null;
    eis: ContributionListingRow | null;
  }> {
    const data = await reportService.socsoEisListing(payrollId);
    return mockRequest({
      socso: data.socso.find((r) => r.employeeId === MOBILE_EMPLOYEE_ID) ?? null,
      eis: data.eis.find((r) => r.employeeId === MOBILE_EMPLOYEE_ID) ?? null,
    });
  },

  async listLeave(): Promise<LeaveRequest[]> {
    return mockRequest(
      [...leaveRequests]
        .filter((l) => l.employeeId === MOBILE_EMPLOYEE_ID)
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    );
  },

  async applyLeave(input: {
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<LeaveRequest> {
    const request: LeaveRequest = {
      id: `lv-${Date.now()}`,
      employeeId: MOBILE_EMPLOYEE_ID,
      type: input.type,
      startDate: input.startDate,
      endDate: input.endDate,
      reason: input.reason,
      status: "pending",
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
    };
    leaveRequests.unshift(request);
    return mockRequest(request);
  },
};

export { monthName };
