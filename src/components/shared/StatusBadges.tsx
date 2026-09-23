import { Badge } from "@/src/components/ui";
import {
  ATTENDANCE_STATUS_LABELS,
  CHECK_IN_APPROVAL_LABELS,
  EMPLOYEE_STATUS_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  PAYROLL_STATUS_LABELS,
} from "@/src/lib/constants";
import type {
  AttendanceStatus,
  CheckInApprovalStatus,
  EmployeeStatus,
  EmploymentType,
  PayrollStatus,
} from "@/src/types";

export function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  const tone =
    status === "active"
      ? "success"
      : status === "on_leave"
        ? "warning"
        : status === "suspended"
          ? "danger"
          : "neutral";
  return <Badge tone={tone}>{EMPLOYEE_STATUS_LABELS[status]}</Badge>;
}

export function EmploymentTypeBadge({ type }: { type: EmploymentType }) {
  return <Badge tone="neutral">{EMPLOYMENT_TYPE_LABELS[type]}</Badge>;
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const tone =
    status === "present"
      ? "success"
      : status === "late"
        ? "warning"
        : status === "absent" || status === "unpaid_leave"
          ? "danger"
          : status === "paid_leave"
            ? "info"
            : "neutral";
  return <Badge tone={tone}>{ATTENDANCE_STATUS_LABELS[status]}</Badge>;
}

export function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  const tone =
    status === "paid"
      ? "success"
      : status === "approved"
        ? "primary"
        : status === "pending_review"
          ? "warning"
          : "neutral";
  return <Badge tone={tone}>{PAYROLL_STATUS_LABELS[status]}</Badge>;
}

export function CheckInApprovalBadge({
  status,
}: {
  status: CheckInApprovalStatus;
}) {
  const tone =
    status === "approved"
      ? "success"
      : status === "rejected"
        ? "danger"
        : "warning";
  return <Badge tone={tone}>{CHECK_IN_APPROVAL_LABELS[status]}</Badge>;
}
