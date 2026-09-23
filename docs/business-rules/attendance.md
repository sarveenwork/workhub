# Business Rules — Attendance

## Purpose

Define attendance tracking, statuses, check-in/check-out behaviour, and the confirmed link between absence and unpaid leave / salary impact.

---

## Confirmed client requirements

### Attendance is a core feature

Each attendance record should support:

| Field | Description |
| --- | --- |
| Date | Attendance date |
| Check-in time | Time employee started |
| Check-out time | Time employee finished |
| Total hours | Computed duration (method TBD for edge cases) |
| Attendance status | See status list below |
| Overtime hours | OT hours associated with the day |
| Notes | Free-text notes |

### Attendance statuses

Confirmed statuses for product design:

- `Present`
- `Late`
- `Absent`
- `Unpaid Leave`
- `Paid Leave`
- `Rest Day`
- `Public Holiday`

### Visual clarity

The UI must make attendance problems visually obvious, for example:

| Status | Example presentation |
| --- | --- |
| Present | `09:00 → 18:00` |
| Late | `09:32 → 18:00` |
| Absent | No check-in |
| Unpaid Leave | Approved / deducted from salary (eventual behaviour) |

### Salary impact of attendance

**Confirmed client rule:**

> **Absence = Unpaid Leave**

Unpaid leave should **eventually** result in a salary deduction.

- Do **not** calculate the deduction amount in the frontend.
- Document the rule here and in [deductions.md](./deductions.md).
- Show **mock** calculated deduction values in payroll views only.

### Check-in experience (product intent)

A simple employee check-in interface should show:

- Employee name
- Current date
- Current time
- Today’s attendance status
- Large **CHECK IN** action
- After check-in: **CHECKED IN — {time}**
- Then **CHECK OUT**

### Security guard check-in (confirmed for demo UI)

For security guards, check-in must also surface:

- **Duty location** (site name + address; demo uses assigned mock post coordinates)
- **Check-in time** (and check-out time when recorded)

Admin / HR must be able to **approve** or **reject** each guard check-in after reviewing location and time.

Exact production rules for live GPS, geofence radius, photo evidence, and who may approve are **TO BE CONFIRMED**. This demo uses mock location data and in-session approval state only.

For this demo phase: mock state only — no live geolocation hardware, biometrics, or backend validation.

### Attendance UI surfaces

Confirmed feature expectations include:

- Calendar / table hybrid attendance interface
- Date / month selectors
- Employee, department, and status filters
- Search
- Daily attendance dashboard (counts for Present, Late, Absent, On Leave)

---

## Assumptions

1. “Late” is determined relative to a configured start time; exact threshold minutes are TBD.
2. Total hours ≈ check-out − check-in, ignoring unpaid breaks until break rules are confirmed.
3. One primary check-in and check-out per employee per day is enough for the demo (split shifts TBD).
4. Managers can view attendance issues; correction permissions TBD.
5. Paid Leave, Rest Day, and Public Holiday are selectable statuses for demo realism; pay treatment TBD.
6. “On Leave” KPI aggregates leave-like statuses for dashboard cards.

---

## Mock / demo behavior

| Area | Demo behavior |
| --- | --- |
| Data source | Mock attendance records for ~30 employees across recent days/months |
| Check-in / out | Updates in-memory / mock store only |
| Guard location | Mock assigned post (label, address, lat/lng) shown on check-in and admin review |
| Guard approval | Admin can approve/reject pending check-ins in `/attendance/check-ins` |
| Geolocation / biometrics | Live GPS / biometrics not implemented |
| Absent → Unpaid Leave | Status mapping shown conceptually; payroll shows mock unpaid-leave deduction |
| Total / OT hours | Pre-seeded or simply derived in mock service — not production-grade |
| Daily dashboard | Aggregates from mock data for “today” |
| Corrections | May be simulated via UI actions without audit persistence |

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

| Topic | Why it matters |
| --- | --- |
| Standard working hours | Defines Present vs Late and OT start |
| Late grace period | e.g. minutes after shift start |
| Break / meal deduction rules | Affects total hours |
| Multiple punches per day | Split shifts, early-out + return |
| Rest day scheduling | Who is on Rest Day and whether OT applies |
| Public holiday calendar | Malaysia federal / state differences |
| Paid leave types & accruals | Annual, medical, etc. |
| Unpaid leave approval workflow | Who approves; when it posts to payroll |
| Unpaid leave salary deduction formula | Daily rate method, hour method, etc. |
| Whether every Absent auto-converts to Unpaid Leave | Confirmed directionally; automation timing TBD |
| Part-time attendance rules | Different expected hours |
| Contract attendance rules | May differ by contract terms |
| Timezone / site location | Multi-site companies |
| Device / kiosk requirements | Future hardware integration |
| Live GPS vs assigned post | Whether check-in uses device GPS, NFC, or rostered site only |
| Geofence / distance tolerance | How far from post is still acceptable |
| Check-in approval workflow | Who may approve/reject; SLA; override rules |
| Effect of rejected check-in | Marks absent? Requires re-submit? Payroll impact? |

### Unpaid leave deduction (directional rule only)

Confirmed:

- Absence maps to Unpaid Leave.
- Unpaid Leave eventually deducts salary.

**TO BE CONFIRMED:** exact calculation, for example (illustrative options only — not chosen):

- Basic salary ÷ working days in month × unpaid days
- Basic salary ÷ calendar days × unpaid days
- Hourly rate × unpaid hours

Do not implement a chosen formula in the frontend.

---

## Future backend requirements

The attendance service must:

1. Persist attendance punches and daily status records.
2. Support `GET /attendance`, `POST /attendance/check-in`, `POST /attendance/check-out`.
3. Apply configurable late / OT / leave policies.
4. Feed unpaid leave days/hours into the payroll engine as deductions.
5. Emit notifications for absences and leave events (see [notifications.md](../backend/notifications.md)).
6. Provide audit logs for manual status overrides.

Until then, the frontend consumes mock attendance services only.

---

## Cross-references

- Overtime hours on attendance days → [overtime.md](./overtime.md)
- Unpaid leave as deduction → [deductions.md](./deductions.md)
- Payroll consumption of attendance → [payroll.md](./payroll.md)
