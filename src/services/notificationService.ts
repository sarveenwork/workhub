import { DEMO_TODAY } from "@/src/lib/constants";
import {
  attendanceConfig,
  attendanceRecords,
  companySettings,
  contributionConfig,
  currentUser,
  employees,
  notifications,
  payrollConfig,
  recentActivity,
} from "@/src/mocks";
import { payrolls } from "@/src/mocks/payroll";
import type {
  ActivityItem,
  AttendanceConfig,
  CompanySettings,
  ContributionConfig,
  DashboardKpis,
  Notification,
  PayrollConfig,
  User,
} from "@/src/types";
import { mockRequest } from "./mockClient";

export const notificationService = {
  async list(): Promise<Notification[]> {
    return mockRequest([...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async unreadCount(): Promise<number> {
    return mockRequest(notifications.filter((n) => !n.read).length);
  },

  async markRead(id: string): Promise<Notification | null> {
    const n = notifications.find((x) => x.id === id);
    if (!n) return mockRequest(null);
    n.read = true;
    return mockRequest(n);
  },

  async markAllRead(): Promise<void> {
    notifications.forEach((n) => {
      n.read = true;
    });
    return mockRequest(undefined);
  },
};

export const dashboardService = {
  async getKpis(): Promise<DashboardKpis> {
    const today = attendanceRecords.filter((r) => r.date === DEMO_TODAY);
    const latest = payrolls.find((p) => p.month === 9 && p.year === 2026) ?? payrolls[0];
    return mockRequest({
      totalEmployees: employees.length,
      activeEmployees: employees.filter((e) => e.status === "active").length,
      presentToday: today.filter((r) => r.status === "present").length,
      lateToday: today.filter((r) => r.status === "late").length,
      absentToday: today.filter((r) => r.status === "absent").length,
      onLeaveToday: today.filter(
        (r) => r.status === "paid_leave" || r.status === "unpaid_leave",
      ).length,
      payrollThisMonth: latest.totalNet,
      employerContribution: latest.totalEmployerContributions,
      pendingPayroll: payrolls.filter(
        (p) => p.status === "draft" || p.status === "pending_review",
      ).length,
    });
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    return mockRequest(recentActivity);
  },

  async getCurrentUser(): Promise<User> {
    if (typeof window !== "undefined") {
      const { authService } = await import("./authService");
      const session = authService.getSession();
      if (session) return mockRequest(session.user);
    }
    return mockRequest(currentUser);
  },
};

export const settingsService = {
  async getCompany(): Promise<CompanySettings> {
    return mockRequest(companySettings);
  },
  async getPayrollConfig(): Promise<PayrollConfig> {
    return mockRequest(payrollConfig);
  },
  async getAttendanceConfig(): Promise<AttendanceConfig> {
    return mockRequest(attendanceConfig);
  },
  async getContributionConfig(): Promise<ContributionConfig> {
    return mockRequest(contributionConfig);
  },
};
