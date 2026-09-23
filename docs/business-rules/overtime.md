# Business Rules — Overtime

## Purpose

Document overtime (OT) rules provided by the client for different worker categories. OT amounts appear in payroll earnings and overall budget salary components.

> **Do not permanently hard-code OT formulas into frontend UI components.** Document here; calculate in the future backend.

---

## Confirmed client requirements

### Overtime must be supported

The system needs to track overtime hours and/or overtime pay as part of workforce and payroll management.

### Security Guards — OT calculation

**Confirmed business rule provided by the client:**

```text
OT rate (Security Guards) =
  Overall budget salary / 30.5 days / 12 hours
```

Notes:

- This is a **documented** rule for backend implementation.
- The frontend demo must **not** permanently hard-code this calculation into presentational components.
- Documented also in [payroll.md](./payroll.md) for overall budget context.
- How “Overall budget salary” is defined for this divisor chain depends on employer contribution configuration — see **TO BE CONFIRMED WITH CLIENT** on overall budget Formula A vs B.

### Other workers — PO / PPO / RG

For **PO / PPO / RG** roles, overtime (or additional-shift pay) is expressed as a **flat amount per additional shift**:

- **RM 60** per additional shift, **or**
- **RM 65** per additional shift

**Confirmed product constraint:**

- Do **not** assume which employees receive RM 60 vs RM 65 unless explicitly configured.
- The UI must be designed so the overtime / additional-shift rate can eventually be configured.

### OT in payroll

Overtime appears as an earnings line in payroll breakdowns and feeds into:

```text
Salary (Basic + OT / Allowance)
```

used by overall budget formulas A and B (see [payroll.md](./payroll.md)).

---

## Assumptions

1. “Security Guards” is a position/role category that can be tagged on employees for OT method selection.
2. PO, PPO, and RG are distinct role codes/titles that share the flat per-shift OT model but may differ in configured rate.
3. Attendance records may store OT hours; monetary OT for guards is derived later by the payroll engine.
4. For PO/PPO/RG, “additional shift” counts may be entered or derived from attendance — exact capture method TBD.
5. Demo OT amounts are mocked for visual realism.

---

## Mock / demo behavior

| Area | Demo behavior |
| --- | --- |
| Security Guard OT | Mock RM amounts on payroll; formula **not** executed as live logic in UI components |
| PO/PPO/RG | Mock shift counts and rates; rate may appear in settings as a placeholder control |
| Approval of OT | Not enforced; may appear as notes or statuses without workflow engine |
| Configuration UI | Payroll / attendance settings may show editable rate fields that only update mock state |

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

| Topic | Status |
| --- | --- |
| Which employees/roles use Security Guard formula vs PO/PPO/RG flat rate | Confirm role mapping |
| RM 60 vs RM 65 assignment rules for PO / PPO / RG | **TO BE CONFIRMED** — must be configurable |
| Definition of “additional shift” | Duration, eligibility, stacking |
| Whether OT requires manager approval before payroll | Process TBD |
| OT on rest days / public holidays | Multipliers TBD |
| Maximum OT caps | Legal and company policy |
| Whether OT enters EPF/SOCSO/EIS wage base | Statutory TBD |
| Exact definition of “Overall budget salary” in the Guard formula | Linked to Formula A vs B confirmation |
| 30.5 days and 12 hours constants | Confirm if fixed forever or configurable |
| Part-time / contract OT eligibility | TBD |
| Rounding of OT rate and OT pay | TBD |

### PO / PPO / RG rate configuration (required design intent)

Production configuration should allow something equivalent to:

| Role | Additional shift rate (RM) | Source |
| --- | --- | --- |
| PO | 60 or 65 | **TO BE CONFIRMED** / configurable |
| PPO | 60 or 65 | **TO BE CONFIRMED** / configurable |
| RG | 60 or 65 | **TO BE CONFIRMED** / configurable |

Do not hard-wire a single rate for all three roles without client confirmation.

---

## Future backend requirements

The payroll / OT engine must:

1. Select OT method by employee role configuration (Guard formula vs flat shift rate).
2. Store configurable rates for PO/PPO/RG (and future roles).
3. Apply Security Guard formula using confirmed overall-budget salary base.
4. Persist OT hours, shift counts, calculated amounts, and approval state.
5. Feed OT earnings into payroll generation and reports.
6. Keep constants (30.5, 12) configurable if the client later changes them.

Frontend guidance: call services for OT display; never embed Guard division math in React components as the source of truth.

---

## Cross-references

- Overall budget formulas → [payroll.md](./payroll.md)
- Attendance OT hours field → [attendance.md](./attendance.md)
- Payroll engine → [../backend/payroll-engine.md](../backend/payroll-engine.md)
