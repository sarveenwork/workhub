# Backend — Export Requirements

## Purpose

Document Excel (and related) export expectations for Workhub. The client requires Excel exports; the frontend demo may offer buttons and optional lightweight mock downloads. Authoritative, server-side export is a **future backend** capability.

---

## Confirmed client requirements

### Export actions required in product UX

Create export affordances such as:

- **Export Excel**
- **Export Payroll**
- **Export EPF**
- **Export SOCSO/EIS**
- **Export Yearly Summary**

These align with the report modules in [reports.md](./reports.md).

### Demo constraint

- If client-side export is simple and safe, a mock/demo Excel download is acceptable.
- Do **not** build complicated export logic into the application architecture as if it were the production engine.
- This document captures expected **backend** export functionality.

### Related outputs

- EA Form generation is future-ready and statutory — not part of demo export authenticity.
- Real server-side Excel generation is out of scope for the current frontend-only phase.

---

## Assumptions

1. Primary format is `.xlsx` (Excel Open XML).
2. CSV may be offered as an additional option later.
3. Filenames include period markers, e.g. `payroll-summary-2026-09.xlsx`.
4. Exports respect the same RBAC as on-screen reports.
5. Large exports may need async generation (email/notification when ready) — **TO BE CONFIRMED**.
6. Character encoding and Malay/English headers TBD with client.

---

## Mock / demo behavior

| Behavior | Demo |
| --- | --- |
| Buttons | Present on report and payroll screens |
| Download | Optional client-generated sheet from mock rows, or placeholder toast “Export prepared (demo)” |
| Server files | None |
| Statutory file formats | Not produced |
| Audit of who exported | Not persisted |

---

## Expected backend export capabilities

### 1. Payroll summary export

Source: Monthly Payroll Summary report.

Suggested columns (match UI/report):

Employee | Basic Salary | OT | Allowances | Gross | EPF | SOCSO | EIS | Tax | Unpaid Leave | Net | Employer Cost

### 2. EPF contribution export

Source: EPF listing. Must clearly distinguish employee vs employer amounts. Official KWSP upload format **TO BE CONFIRMED**.

### 3. SOCSO / EIS export

Source: SOCSO/EIS listing. Official PERKESO formats **TO BE CONFIRMED**.

### 4. Yearly individual summary export

Source: yearly report for one employee + year; include monthly rows and totals.

### 5. Generic “Export Excel”

Context-sensitive export of the current filtered table (employees, attendance, or payroll list). Exact scope **TO BE CONFIRMED**.

### API approach (future)

Options (choose during backend design):

```text
GET /reports/payroll/export?year=&month=&format=xlsx
GET /reports/epf/export?year=&month=&format=xlsx
GET /reports/socso-eis/export?year=&month=&format=xlsx
GET /reports/yearly/export?employeeId=&year=&format=xlsx
```

Or `Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` on existing report GETs.

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

| Topic | Notes |
| --- | --- |
| Official statutory file layouts | KWSP, PERKESO, LHDN |
| Bank payment file format | For `Paid` payroll disbursement |
| Required column order and headers | Especially bilingual needs |
| Async vs sync download | Company size dependent |
| Watermarking / “draft” labels on non-paid runs | |
| Whether Managers may export | RBAC |
| Retention of generated files | Storage policy |
| EA Form PDF vs Excel | Format TBD |

---

## Future backend requirements

1. Generate `.xlsx` on the server from payroll snapshots (same numbers as UI reports).
2. Stream or store files securely with short-lived download URLs.
3. Log export events (who, what, when, filters).
4. Keep export column mapping configurable where statutory templates change yearly.
5. Do not trust the browser as the source of exported monetary figures in production.
6. Coordinate with [notifications.md](./notifications.md) when async exports complete.

---

## Frontend guidance

- Keep an `reportService.export*(...)` method that today returns a mock blob or resolves a demo promise.
- Avoid scattering spreadsheet libraries across feature pages; centralise export helpers.
- Label demo downloads clearly if figures are illustrative.
