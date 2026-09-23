# Backend — Payroll Engine

## Purpose

Describe the future **authoritative payroll calculation and lifecycle service**. The frontend demo must not act as the payroll engine. All statutory and company policy math belongs here.

---

## Confirmed client requirements

### Responsibilities

The engine must eventually produce payroll consistent with client-facing modules:

- Earnings: basic salary, overtime, allowances
- Employee deductions: EPF, SOCSO, EIS, PCB, unpaid leave, other
- Employer contributions: EPF, SOCSO, EIS
- Net salary
- Overall employer cost / budget

### Overall budget formulas (both must be supported until confirmation)

#### Formula A

```text
Overall Budget =
  Salary (Basic + OT / Allowance)
  + EPF Employer Portion
  + SOCSO Employer Portion
  + EIS Employer Portion
```

#### Formula B

```text
Overall Budget =
  Salary (Basic + OT / Allowance)
  + EPF Employer Portion
```

> **TO BE CONFIRMED WITH CLIENT** which formula (or per-config selection) is production policy.

### Overtime inputs

- **Security Guards:** `Overall budget salary / 30.5 / 12` — document and implement in engine only; do not hard-code in UI components.
- **PO / PPO / RG:** RM60 or RM65 per additional shift — rate **TO BE CONFIRMED** / configurable.

### Unpaid leave

Absence = Unpaid Leave; unpaid leave eventually deducts salary. Deduction **method** is **TO BE CONFIRMED**; engine applies the confirmed rule using attendance data.

### Lifecycle

```text
Draft → Pending Review → Approved → Paid
```

APIs: `POST /payroll/generate`, `POST /payroll/:id/approve`, `POST /payroll/:id/pay`.

### Non-goals for frontend

No real EPF/SOCSO/EIS calculation or statutory submission in the demo.

---

## Assumptions

1. Generation is month-based (`year` + `month`).
2. Engine reads frozen inputs: employee snapshot, attendance summary, allowances effective in period, OT configuration.
3. Recalculation of a `Draft` run is allowed; recalculation after `Approved` is restricted (**TO BE CONFIRMED**).
4. Employer cost field on each payroll item stores the configured overall budget result.
5. All money math uses a single rounding policy once confirmed.

---

## Mock / demo behavior

| Step | Demo |
| --- | --- |
| Generate | Creates mock run with pre-seeded lines |
| Approve / Pay | Status flag updates only |
| Guard OT formula | Not executed as live UI logic |
| Statutory rates | Placeholder amounts |
| Idempotent regenerate | Mock may replace draft data in memory |

---

## Proposed generation pipeline (future)

```text
1. Validate period not locked / no conflicting Paid run (rules TBD)
2. Select employees in scope (active + mid-month join/resign rules TBD)
3. Aggregate attendance → present/late/absent/unpaid leave days/hours
4. Resolve allowances effective for period
5. Calculate OT amounts by employee OT method (Guard formula vs shift rate)
6. Compute gross = basic + OT + allowances (confirm exact composition)
7. Compute employee statutory deductions from rate tables (TBD rates)
8. Compute unpaid leave deduction (TBD formula)
9. Compute employer contributions (TBD rates)
10. Compute net = gross − employee deductions
11. Compute overall budget via configured Formula A or B
12. Persist payroll_run + payroll_items + line snapshots
13. Emit notifications (“payroll ready for review”)
```

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

| Topic | Impact |
| --- | --- |
| Formula A vs B vs configurable | Employer cost |
| All statutory rates / wage bases | EPF, SOCSO, EIS, PCB |
| Unpaid leave formula | Deduction line |
| Mid-month proration | Basic & allowances |
| Part-time / contract methods | Gross pay |
| Rounding | Nets and contributions |
| Cutoff / lock date | When generate is allowed |
| Who can approve / pay | Security |
| Retro pay / corrections | Post-paid adjustments |
| Inclusion of allowances/OT in contribution wages | Statutory |

---

## Future backend requirements

1. Implement the pipeline as a transactional service.
2. Version rate tables and OT configs by `effective_from`.
3. Store immutable snapshots on approve/pay for audit and EA/year reports.
4. Reject invalid status transitions.
5. Expose calculation explanations (optional debug lines) for HR support without putting logic in the browser.
6. Integrate with [reports](./reports.md) and [exports](./export-requirements.md).
7. Keep Security Guard OT and shift rates in configuration, not hardcoded constants scattered in code (centralise documented defaults: 30.5, 12, RM60/RM65 options).

---

## Cross-references

- Business rules: [../business-rules/payroll.md](../business-rules/payroll.md), [overtime.md](../business-rules/overtime.md), [contributions.md](../business-rules/contributions.md)
- API: [api-requirements.md](./api-requirements.md)
