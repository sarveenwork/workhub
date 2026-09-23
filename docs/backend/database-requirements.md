# Backend — Database Requirements

## Purpose

Describe the data the future Workhub backend must persist. No database is implemented in the frontend demo; mock data in `src/mocks` approximates these entities for UI development.

---

## Confirmed client requirements (data domains)

The product requires durable records for at least:

- Employees and employment information
- Attendance (check-in/out, status, hours, OT hours, notes)
- Overtime-related inputs/results (hours, shifts, amounts)
- Allowances (Petrol, Management; extensible types)
- Payroll runs and per-employee payroll items / breakdowns
- Deductions and employer contributions
- Reports inputs (or derived from payroll — implementation choice)
- Notifications
- Company/settings configuration (payroll, attendance, contributions, users & roles)

Sensitive fields confirmed in employee design:

- IC / Passport number
- Bank name and bank account number

These must be stored securely and masked in list APIs/UI.

---

## Assumptions

1. Relational database (e.g. PostgreSQL) is a reasonable default; final choice **TO BE CONFIRMED**.
2. Soft deletes for employees and configuration rows are preferred over hard deletes for auditability.
3. Money stored as integer cents or `NUMERIC(12,2)` — **TO BE CONFIRMED**.
4. All timestamps stored in UTC; displayed in Malaysia time (Asia/Kuala_Lumpur) in UI.
5. Multi-tenant `company_id` on rows is advisable even if the demo is single-company.

---

## Mock / demo behavior

Frontend uses TypeScript types and JSON/TS mock modules — not SQL. Field names in mocks should stay close to the conceptual schema below to ease migration.

---

## Conceptual schema

### `users`

| Field | Notes |
| --- | --- |
| id | PK |
| email | Login identifier |
| name | Display name |
| role | `admin` \| `manager` \| `employee` (exact enum TBD) |
| employee_id | Optional link for employee self-service |
| status | Active / disabled |
| created_at / updated_at | Audit |

### `employees`

| Field | Notes |
| --- | --- |
| id | PK |
| employee_code | Business Employee ID |
| full_name | Required for UI |
| ic_passport | Encrypted / restricted |
| bank_name | Restricted |
| bank_account_number | Encrypted / restricted |
| join_date | |
| resign_date | Nullable |
| employment_type | full-time / part-time / contract |
| department_id | FK |
| position_id | FK |
| basic_salary | |
| status | active / on_leave / resigned / suspended |
| avatar_url | Nullable |
| contact_json | Phone, email, address |
| emergency_contact_json | |
| notes | |
| ot_method / role_flags | e.g. security_guard, po, ppo, rg — **TO BE CONFIRMED** modelling |
| created_at / updated_at | |

### `departments` / `positions`

Simple lookup tables: id, name, status, company_id.

### `allowance_types`

id, code (`petrol`, `management`, …), name, active.

### `employee_allowances`

id, employee_id, allowance_type_id, amount, frequency, effective_from, effective_to, status.

### `attendance_records`

| Field | Notes |
| --- | --- |
| id | PK |
| employee_id | FK |
| date | Local work date |
| check_in_at | Nullable timestamptz |
| check_out_at | Nullable timestamptz |
| total_hours | Nullable |
| overtime_hours | Nullable |
| status | present / late / absent / unpaid_leave / paid_leave / rest_day / public_holiday |
| notes | |
| source | kiosk / web / import / manual — TBD |
| unique | (employee_id, date) assumed |

### `payroll_runs`

id, year, month, status (`draft` / `pending_review` / `approved` / `paid`), generated_at, approved_at, paid_at, totals JSON/columns.

### `payroll_items`

Per employee within a run:

- basic_salary, overtime_amount, allowance_total, gross
- epf_employee, socso_employee, eis_employee, pcb, unpaid_leave, other_deductions, total_deductions, net
- epf_employer, socso_employer, eis_employer
- employer_cost / overall_budget
- breakdown_json for line-level detail (optional)

### `contribution_rate_tables`

Versioned rates by effective date — **content TO BE CONFIRMED**; structure required.

### `ot_rate_configs`

Configurable PO/PPO/RG shift rates (RM60/RM65) and Security Guard formula parameters (30.5, 12) — defaults documented in business rules; values **TO BE CONFIRMED**.

### `notifications`

id, user_id, category, title, body, read_at, created_at, metadata JSON.

### `audit_logs`

actor_id, action, entity_type, entity_id, before/after, created_at.

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

- Database engine and hosting
- Encryption approach for IC and bank account (column encryption, KMS, etc.)
- Retention policy for attendance and payroll
- Whether payroll line items are fully normalised vs JSON snapshots
- Document storage for EA forms and employee documents
- Exact modelling of PO/PPO/RG vs Security Guard OT method
- Multi-branch / multi-company schema needs
- Mandatory employee columns for create

---

## Future backend requirements

1. Migrate mock TypeScript domain models to real tables with migrations.
2. Enforce referential integrity between employees, attendance, and payroll items.
3. Index common filters: employee status, attendance date, payroll year/month, notification user+unread.
4. Never return full IC/bank account in list endpoints by default.
5. Support point-in-time reconstruction of payslips (store snapshots of calculated lines).
6. Align API DTOs with this schema ([api-requirements.md](./api-requirements.md)).

---

## Security notes

Even before production:

- Treat IC and bank data as PII.
- Prefer field-level access control for Managers vs HR.
- Mask in UI: `******-**-1234`, `**** **** 4821` patterns as used in the demo guidelines.
