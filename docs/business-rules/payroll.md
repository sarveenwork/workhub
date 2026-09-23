# Business Rules — Payroll

## Purpose

Define how Workhub models salary, payroll runs, breakdowns, statuses, and **overall employer budget / cost**. This document is the source of truth for what is confirmed by the client versus what remains open.

> **Important:** The frontend demo must **not** permanently hard-code payroll calculation formulas into UI components. Display mock values; the future backend [payroll engine](../backend/payroll-engine.md) owns authoritative math.

---

## Confirmed client requirements

### Payroll module capabilities

The system must support viewing and managing:

- Payroll dashboard / overview
- Monthly payroll list
- Payroll detail (run-level)
- Employee payroll detail
- Payroll breakdown covering:
  - Earnings
  - Allowances
  - Overtime
  - Deductions
  - Employer contributions
  - Net salary
  - Overall employer cost

### Payroll statuses and workflow

Supported statuses:

| Status | Meaning (product intent) |
| --- | --- |
| `Draft` | Generated or in progress; not submitted for decision |
| `Pending Review` | Awaiting review / approval |
| `Approved` | Approved for payment |
| `Paid` | Marked as paid |

Confirmed flow to demonstrate:

```text
Draft → Pending Review → Approved → Paid
```

Exact transition permissions (who may approve/pay) are **TO BE CONFIRMED** for production RBAC; Admin/HR is assumed for the demo.

### Salary components in a payroll breakdown (illustrative structure)

The client-provided example structure (amounts are **examples only**, not rates):

**Earnings**

- Basic Salary
- Overtime
- Petrol Allowance
- Management Allowance
- → Gross Salary

**Employee deductions**

- EPF (employee)
- SOCSO (employee)
- EIS (employee)
- PCB
- Unpaid Leave
- → Total Deductions
- → Net Salary

**Employer contributions**

- EPF (employer)
- SOCSO (employer)
- EIS (employer)

**Employer cost**

- Overall employer cost / budget for the employee period

### Overall budget — both formulas must be documented

The client has stated **two** overall budget concepts. Because the correct formula may depend on employee or company configuration, **neither is assumed universally correct**.

#### Formula A — Salary + full employer statutory set

```text
Overall Budget =
  Salary (Basic + OT / Allowance)
  + EPF Employer Portion
  + SOCSO Employer Portion
  + EIS Employer Portion
```

#### Formula B — Salary + EPF employer only

```text
Overall Budget =
  Salary (Basic + OT / Allowance)
  + EPF Employer Portion
```

### Employer contribution configuration

> **TO BE CONFIRMED WITH CLIENT**

Which formula applies (A, B, or a per-employee / per-company configuration) must be confirmed before production implementation. The UI should present overall employer cost as a configured outcome, not a hard-wired choice.

### Related confirmed rules that feed payroll

- Absence is treated as **Unpaid Leave** and eventually deducts salary (method TBD) — see [attendance.md](./attendance.md) and [deductions.md](./deductions.md)
- Overtime rules differ by role family — see [overtime.md](./overtime.md)
- Current allowance types: Petrol, Management — see [allowances.md](./allowances.md)
- Statutory contribution categories: EPF, SOCSO, EIS — see [contributions.md](./contributions.md)

---

## Assumptions

1. A payroll “run” is monthly (calendar month) for the demo.
2. Gross salary for display ≈ Basic + OT + Allowance line items shown on the payslip.
3. Net salary for display ≈ Gross − employee deductions.
4. Employer cost for display uses one of the overall budget formulas with **mock** contribution amounts.
5. Payroll generation in the demo creates a `Draft` run from mock attendance/earnings inputs.
6. Currency is RM; amounts shown to two decimal places in UI (rounding policy still TBD).
7. One active payroll run per company per month is sufficient for demo UX (multiple correction runs are future).

---

## Mock / demo behavior

| Behavior | Demo implementation |
| --- | --- |
| Payroll amounts | Seeded / mocked per employee; **not** computed from live EPF/SOCSO/EIS tables |
| Generate payroll | Service call returns mock run; no server job |
| Approve / pay | Status transitions in mock store only |
| Overall budget | Displayed from mock fields; formula A vs B not locked in code |
| Unpaid leave line | Shown as a deduction amount from mock data |
| Labels | Demo data may be marked as illustrative where useful |

Example mock breakdown (illustrative only):

| Line | Amount |
| --- | --- |
| Basic Salary | RM 3,000 |
| Overtime | RM 300 |
| Petrol Allowance | RM 200 |
| Management Allowance | RM 500 |
| Gross Salary | RM 4,000 |
| EPF / SOCSO / EIS / PCB / Unpaid Leave | Mock placeholders |
| Net Salary | Mock |
| Employer contributions & cost | Mock |

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

| Topic | Notes |
| --- | --- |
| Overall budget formula A vs B | **TO BE CONFIRMED WITH CLIENT** — may be configurable |
| Exact meaning of `Salary (Basic + OT / Allowance)` | Confirm operator precedence / grouping (addition of OT and allowances) |
| Whether allowances are included in contribution wage base | Statutory treatment TBD |
| Whether OT is included in contribution wage base | Statutory treatment TBD |
| EPF / SOCSO / EIS / PCB rates | Do not invent rates |
| Rounding rules | Per line vs final net |
| Mid-month join / resign proration | Method TBD |
| Part-time / contract payroll method | Method TBD |
| Payroll cutoff date | When attendance locks for a run |
| Payroll payment date | When `Paid` is expected vs actual bank file |
| Who can approve / pay | Role matrix |
| Retroactive adjustments / backpay | Process TBD |
| Multiple pay frequencies | Monthly assumed for demo only |

---

## Future backend requirements

The payroll engine must:

1. Generate payroll runs from attendance, OT, allowances, and employee master data.
2. Apply **configurable** overall budget / employer cost rules (support both Formula A and Formula B until client locks policy).
3. Persist full breakdown lines with audit history.
4. Enforce status workflow and permissions.
5. Expose APIs: `GET /payroll`, `GET /payroll/:id`, `POST /payroll/generate`, `POST /payroll/:id/approve`, `POST /payroll/:id/pay` — see [api-requirements.md](../backend/api-requirements.md).
6. Never rely on the browser for statutory correctness.

Details: [payroll-engine.md](../backend/payroll-engine.md).

---

## Implementation guidance for frontend

- Keep payroll math in services/mocks or precomputed mock JSON — not in presentational components.
- Surface both overall budget concepts in documentation and settings copy as “configurable / pending confirmation”.
- Do not encode Formula A or Formula B as the only path without a configuration flag.
- Mask sensitive employee identifiers on payroll list views.
