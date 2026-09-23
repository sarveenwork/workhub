export type EmploymentType = "full_time" | "part_time" | "contract";

export type EmployeeStatus = "active" | "on_leave" | "resigned" | "suspended";

export type AttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | "unpaid_leave"
  | "paid_leave"
  | "rest_day"
  | "public_holiday";

export type PayrollStatus = "draft" | "pending_review" | "approved" | "paid";

export type AllowanceType =
  | "petrol"
  | "management"
  | "housing"
  | "meal"
  | "travel"
  | "phone"
  | "other";

export type AllowanceFrequency = "monthly" | "daily" | "one_time";

export type AllowanceStatus = "active" | "inactive" | "pending";

export type DeductionType =
  | "epf"
  | "socso"
  | "eis"
  | "pcb"
  | "unpaid_leave"
  | "other";

export type ContributionType = "epf" | "socso" | "eis";

export type NotificationCategory =
  | "payroll"
  | "attendance"
  | "leave"
  | "system"
  | "report";

export type UserRole = "admin" | "manager" | "employee";

export interface Department {
  id: string;
  name: string;
  code: string;
  employeeCount: number;
}

export interface Position {
  id: string;
  title: string;
  departmentId: string;
  code: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  icPassport: string;
  email: string;
  phone: string;
  bankName: string;
  bankAccountNumber: string;
  joinDate: string;
  resignDate: string | null;
  employmentType: EmploymentType;
  departmentId: string;
  positionId: string;
  basicSalary: number;
  status: EmployeeStatus;
  avatarUrl: string | null;
  emergencyContact: EmergencyContact | null;
  notes: string | null;
  overtimeRatePerShift: number | null;
  isSecurityGuard: boolean;
}

export interface Allowance {
  id: string;
  employeeId: string;
  type: AllowanceType;
  label: string;
  amount: number;
  frequency: AllowanceFrequency;
  effectiveDate: string;
  status: AllowanceStatus;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number | null;
  overtimeHours: number;
  status: AttendanceStatus;
  notes: string | null;
}

/** Admin review state for a security-guard check-in punch. */
export type CheckInApprovalStatus = "pending" | "approved" | "rejected";

export interface CheckInLocation {
  label: string;
  address: string;
  /** Demo coordinates only — not live GPS. */
  latitude: number;
  longitude: number;
}

export interface CheckInRequest {
  id: string;
  employeeId: string;
  date: string;
  checkInAt: string;
  checkOutAt: string | null;
  location: CheckInLocation;
  attendanceStatus: AttendanceStatus | "not_started";
  approvalStatus: CheckInApprovalStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  submittedAt: string;
}

export type ShiftStatus = "scheduled" | "completed" | "missed" | "off";

export interface Shift {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: CheckInLocation;
  roleLabel: string;
  status: ShiftStatus;
  notes: string | null;
}

export type LeaveRequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export type LeaveType = "paid_leave" | "unpaid_leave" | "medical" | "emergency";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
  submittedAt: string;
  reviewedAt: string | null;
}

export interface DeductionLine {
  type: DeductionType;
  label: string;
  amount: number;
}

export interface ContributionLine {
  type: ContributionType;
  label: string;
  employeeAmount: number;
  employerAmount: number;
}

export interface PayrollItem {
  id: string;
  payrollId: string;
  employeeId: string;
  basicSalary: number;
  overtime: number;
  allowances: { type: AllowanceType; label: string; amount: number }[];
  grossSalary: number;
  deductions: DeductionLine[];
  totalDeductions: number;
  netSalary: number;
  employerContributions: ContributionLine[];
  totalEmployerContributions: number;
  employerCost: number;
}

export interface Payroll {
  id: string;
  periodLabel: string;
  year: number;
  month: number;
  status: PayrollStatus;
  employeeCount: number;
  totalGross: number;
  totalNet: number;
  totalEmployerContributions: number;
  totalEmployerCost: number;
  generatedAt: string;
  approvedAt: string | null;
  paidAt: string | null;
  items: PayrollItem[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  createdAt: string;
  type: "attendance" | "payroll" | "employee" | "system";
}

export interface DashboardKpis {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
  onLeaveToday: number;
  payrollThisMonth: number;
  employerContribution: number;
  pendingPayroll: number;
}

export interface AttendanceOverview {
  present: number;
  late: number;
  absent: number;
  leave: number;
}

export interface PayrollTrendPoint {
  month: string;
  netPayroll: number;
  employerCost: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface EmployeeFilters {
  search?: string;
  employmentType?: EmploymentType | "all";
  status?: EmployeeStatus | "all";
  departmentId?: string | "all";
  sortBy?: "name" | "joinDate" | "salary" | "employeeId";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface AttendanceFilters {
  date?: string;
  month?: string;
  employeeId?: string;
  departmentId?: string | "all";
  status?: AttendanceStatus | "all";
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CompanySettings {
  name: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  timezone: string;
}

export interface PayrollConfig {
  cutoffDay: number | null;
  paymentDay: number | null;
  includeSocsoInEmployerCost: boolean | null;
  includeEisInEmployerCost: boolean | null;
  notes: string;
}

export interface AttendanceConfig {
  standardStartTime: string;
  standardEndTime: string;
  lateGraceMinutes: number | null;
  workingDaysPerMonth: number | null;
  notes: string;
}

export interface ContributionConfig {
  epfEmployeeRate: number | null;
  epfEmployerRate: number | null;
  socsoEmployeeRate: number | null;
  socsoEmployerRate: number | null;
  eisEmployeeRate: number | null;
  eisEmployerRate: number | null;
  notes: string;
}

export interface MonthlyPayrollSummaryRow {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  basicSalary: number;
  overtime: number;
  allowances: number;
  grossSalary: number;
  epf: number;
  socso: number;
  eis: number;
  tax: number;
  unpaidLeave: number;
  netSalary: number;
  employerCost: number;
}

export interface YearlyPayrollMonth {
  month: number;
  label: string;
  basicSalary: number;
  overtime: number;
  allowances: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  employerCost: number;
}

export interface ContributionListingRow {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  employeeAmount: number;
  employerAmount: number;
  total: number;
}
