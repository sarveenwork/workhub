# Business Rules — Deductions

## Purpose

Define employee-side deductions that appear on payroll, including Malaysian statutory categories and unpaid leave. Exact statutory rates are **not** specified here and must not be invented.

---

## Confirmed client requirements

### Deduction categories to support

The system needs to support deductions including:

| Category | Notes |
| --- | --- |
| **EPF** | Employee portion |
| **SOCSO** | Employee portion |
| **EIS** | Employee portion |
| **Income Tax / PCB** | Monthly tax deduction |
| **Unpaid Leave** | Linked to absence / unpaid leave |
| **Other deductions** | Extensible catch-all |

### Unpaid leave deduction

Confirmed direction from client:

1. **Absence = Unpaid Leave** (see [attendance.md](./attendance.md)).
2. Unpaid Leave should **eventually** result in a salary deduction.
3. Frontend must **not** calculate the authoritative deduction.
4. Demo may **display mock** unpaid-leave deduction values on payroll screens.

### Payroll breakdown placement

Employee deductions appear under a dedicated section, summing to **Total Deductions**, which reduce Gross Salary to **Net Salary**.

Illustrative structure (amounts are examples / placeholders only):

```text
Employee Deductions
  EPF ............ RM xxx
  SOCSO .......... RM xxx
  EIS ............ RM xxx
  PCB ............ RM xxx
  Unpaid Leave ... RM xxx
  Other .......... RM xxx
  Total Deductions RM xxx
Net Salary ....... RM xxx
```

### No statutory rate implementation in the demo

Do **not** implement Malaysian statutory contribution or tax rates in the frontend.

Use configurable **mock values** for demonstration. The backend will eventually contain authoritative calculation rules.

---

## Assumptions

1. “Other deductions” covers company loans, advances, or miscellaneous items in future; demo may include 0–1 sample lines.
2. Deduction lines are shown per employee per payroll period.
3. Employee EPF/SOCSO/EIS are distinct from employer contribution lines (see [contributions.md](./contributions.md)).
4. Negative net pay handling is out of scope for the demo.
5. PCB is shown as a single monthly amount in mock payslips.

---

## Mock / demo behavior

| Area | Demo behavior |
| --- | --- |
| Rates | Hardcoded mock RM amounts or simple placeholders — **not** official tables |
| Unpaid leave | Mock deduction amount when attendance shows unpaid leave / absence |
| PCB | Mock value; no LHDN logic |
| Editing | Settings may expose mock rate fields that only affect demo display |
| Validation | No enforcement of statutory minimums/maximums |

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

| Topic | Status |
| --- | --- |
| Exact EPF employee rates / wage brackets | **TO BE CONFIRMED** — do not invent |
| Exact SOCSO employee rates | **TO BE CONFIRMED** |
| Exact EIS employee rates | **TO BE CONFIRMED** |
| PCB calculation method | **TO BE CONFIRMED** |
| Unpaid leave deduction formula | **TO BE CONFIRMED** (daily/hourly/proration method) |
| Rounding rules | **TO BE CONFIRMED** |
| Order of deduction application | **TO BE CONFIRMED** |
| Whether unpaid leave reduces contribution wage base | **TO BE CONFIRMED** |
| Voluntary EPF top-ups | **TO BE CONFIRMED** |
| Company loan / advance deduction rules | **TO BE CONFIRMED** |
| Deduction approval workflow | **TO BE CONFIRMED** |

### Unpaid leave — documentation-only calculation note

Possible approaches (none selected):

- Deduct `(Basic ÷ working days) × unpaid days`
- Deduct `(Basic ÷ calendar days) × unpaid days`
- Deduct hourly rate × unpaid hours

Mark any UI that shows a figure as **mock** until the client confirms the method.

---

## Future backend requirements

The payroll engine must:

1. Calculate employee statutory deductions from configured rate tables (kept up to date for Malaysia).
2. Calculate unpaid leave deductions from attendance inputs using the confirmed formula.
3. Support configurable “other” deduction types with effective dating.
4. Persist each deduction line for payslips, reports, and exports.
5. Keep employee deductions separate from employer contributions in data and APIs.

See [payroll-engine.md](../backend/payroll-engine.md) and [contributions.md](./contributions.md).

---

## Cross-references

- Attendance absence rule → [attendance.md](./attendance.md)
- Employer-side amounts → [contributions.md](./contributions.md)
- Overall net and employer cost → [payroll.md](./payroll.md)
