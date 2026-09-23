import { DEMO_TODAY } from "@/src/lib/constants";
import {
  attendanceRecords,
  checkInRequests,
  checkInSession,
  employees,
} from "@/src/mocks";
import { getTodayShift } from "@/src/mocks/employeeMobile";
import type {
  AttendanceFilters,
  AttendanceOverview,
  AttendanceRecord,
  CheckInApprovalStatus,
  CheckInRequest,
  PaginatedResult,
} from "@/src/types";
import { mockRequest, paginate } from "./mockClient";

function formatClock(date = new Date()): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export const attendanceService = {
  async list(filters: AttendanceFilters = {}): Promise<PaginatedResult<AttendanceRecord>> {
    let result = [...attendanceRecords];

    if (filters.date) {
      result = result.filter((r) => r.date === filters.date);
    }

    if (filters.month) {
      result = result.filter((r) => r.date.startsWith(filters.month!));
    }

    if (filters.employeeId) {
      result = result.filter((r) => r.employeeId === filters.employeeId);
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((r) => r.status === filters.status);
    }

    if (filters.departmentId && filters.departmentId !== "all") {
      const ids = new Set(
        employees.filter((e) => e.departmentId === filters.departmentId).map((e) => e.id),
      );
      result = result.filter((r) => ids.has(r.employeeId));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const ids = new Set(
        employees
          .filter(
            (e) =>
              e.fullName.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q),
          )
          .map((e) => e.id),
      );
      result = result.filter((r) => ids.has(r.employeeId));
    }

    result.sort((a, b) => b.date.localeCompare(a.date) || a.employeeId.localeCompare(b.employeeId));

    return mockRequest(paginate(result, filters.page ?? 1, filters.pageSize ?? 15));
  },

  async getTodayOverview(date = DEMO_TODAY): Promise<AttendanceOverview & { date: string }> {
    const today = attendanceRecords.filter((r) => r.date === date);
    return mockRequest({
      date,
      present: today.filter((r) => r.status === "present").length,
      late: today.filter((r) => r.status === "late").length,
      absent: today.filter((r) => r.status === "absent").length,
      leave: today.filter((r) => r.status === "paid_leave" || r.status === "unpaid_leave")
        .length,
    });
  },

  async getByEmployee(employeeId: string, month?: string): Promise<AttendanceRecord[]> {
    let result = attendanceRecords.filter((r) => r.employeeId === employeeId);
    if (month) result = result.filter((r) => r.date.startsWith(month));
    result.sort((a, b) => b.date.localeCompare(a.date));
    return mockRequest(result);
  },

  async getCheckInSession() {
    return mockRequest({ ...checkInSession, location: { ...checkInSession.location } });
  },

  async listCheckInRequests(filters?: {
    approvalStatus?: CheckInApprovalStatus | "all";
  }): Promise<CheckInRequest[]> {
    let result = [...checkInRequests];
    if (filters?.approvalStatus && filters.approvalStatus !== "all") {
      result = result.filter((r) => r.approvalStatus === filters.approvalStatus);
    }
    result.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    return mockRequest(result.map((r) => ({ ...r, location: { ...r.location } })));
  },

  async pendingCheckInCount(): Promise<number> {
    return mockRequest(
      checkInRequests.filter((r) => r.approvalStatus === "pending").length,
    );
  },

  async checkIn(): Promise<typeof checkInSession> {
    const now = new Date();
    const time = formatClock(now);
    const late =
      now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);
    const attendanceStatus = late ? "late" : "present";
    const todayShift = getTodayShift(DEMO_TODAY);
    if (todayShift && todayShift.status !== "off") {
      checkInSession.location = { ...todayShift.location };
    }

    checkInSession.checkIn = time;
    checkInSession.checkOut = null;
    checkInSession.status = attendanceStatus;
    checkInSession.approvalStatus = "pending";

    const existingIdx = checkInRequests.findIndex(
      (r) =>
        r.employeeId === checkInSession.employeeId &&
        r.date === DEMO_TODAY &&
        r.approvalStatus === "pending",
    );

    const request: CheckInRequest = {
      id: existingIdx >= 0 ? checkInRequests[existingIdx].id : `cin-${Date.now()}`,
      employeeId: checkInSession.employeeId,
      date: DEMO_TODAY,
      checkInAt: time,
      checkOutAt: null,
      location: { ...checkInSession.location },
      attendanceStatus,
      approvalStatus: "pending",
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null,
      submittedAt: now.toISOString(),
    };

    if (existingIdx >= 0) {
      checkInRequests[existingIdx] = request;
    } else {
      checkInRequests.unshift(request);
    }
    checkInSession.requestId = request.id;

    return mockRequest({ ...checkInSession, location: { ...checkInSession.location } });
  },

  async checkOut(): Promise<typeof checkInSession> {
    const now = new Date();
    const time = formatClock(now);
    checkInSession.checkOut = time;

    if (checkInSession.requestId) {
      const req = checkInRequests.find((r) => r.id === checkInSession.requestId);
      if (req) req.checkOutAt = time;
    }

    return mockRequest({ ...checkInSession, location: { ...checkInSession.location } });
  },

  async reviewCheckIn(
    id: string,
    decision: "approved" | "rejected",
    notes?: string,
  ): Promise<CheckInRequest | null> {
    const req = checkInRequests.find((r) => r.id === id);
    if (!req) return mockRequest(null);

    req.approvalStatus = decision;
    req.reviewedBy = "Deepa Krishnan";
    req.reviewedAt = new Date().toISOString();
    req.reviewNotes = notes?.trim() || null;

    if (checkInSession.requestId === id) {
      checkInSession.approvalStatus = decision;
    }

    return mockRequest({ ...req, location: { ...req.location } });
  },
};
