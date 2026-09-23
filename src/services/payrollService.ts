import { allowances } from "@/src/mocks";
import { payrolls } from "@/src/mocks/payroll";
import type { Allowance, Payroll, PayrollItem, PayrollStatus, PayrollTrendPoint } from "@/src/types";
import { mockRequest } from "./mockClient";

export const payrollService = {
  async list(): Promise<Payroll[]> {
    const summary = payrolls.map((payroll) => {
      const { items, ...rest } = payroll;
      void items;
      return { ...rest, items: [] as typeof payroll.items };
    });
    return mockRequest(summary);
  },

  async getById(id: string): Promise<Payroll | null> {
    return mockRequest(payrolls.find((p) => p.id === id) ?? null);
  },

  async getEmployeeItem(payrollId: string, employeeId: string): Promise<PayrollItem | null> {
    const payroll = payrolls.find((p) => p.id === payrollId);
    return mockRequest(payroll?.items.find((i) => i.employeeId === employeeId) ?? null);
  },

  async getEmployeeHistory(employeeId: string): Promise<PayrollItem[]> {
    const items = payrolls
      .filter((p) => p.status !== "draft")
      .flatMap((p) => p.items.filter((i) => i.employeeId === employeeId).map((i) => ({ ...i, payrollId: p.id })));
    return mockRequest(items);
  },

  async getTrend(): Promise<PayrollTrendPoint[]> {
    const points = [...payrolls]
      .filter((p) => p.status !== "draft")
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((p) => ({
        month: p.periodLabel.split(" ")[0].slice(0, 3),
        netPayroll: Math.round(p.totalNet),
        employerCost: Math.round(p.totalEmployerCost),
      }));
    return mockRequest(points);
  },

  async updateStatus(id: string, status: PayrollStatus): Promise<Payroll | null> {
    const payroll = payrolls.find((p) => p.id === id);
    if (!payroll) return mockRequest(null);
    payroll.status = status;
    if (status === "approved") payroll.approvedAt = new Date().toISOString();
    if (status === "paid") payroll.paidAt = new Date().toISOString();
    if (status === "pending_review" && !payroll.generatedAt) {
      payroll.generatedAt = new Date().toISOString();
    }
    return mockRequest(payroll);
  },

  async getAllowances(employeeId?: string): Promise<Allowance[]> {
    const list = employeeId
      ? allowances.filter((a) => a.employeeId === employeeId)
      : allowances;
    return mockRequest(list);
  },
};
