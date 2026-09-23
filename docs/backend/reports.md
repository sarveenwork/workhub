# Backend — Reports

## Purpose

Specify report types required by the client, demo behaviour, and future backend generation responsibilities.

---

## Confirmed client requirements

### 1. Monthly Payroll Summary

Include columns:

- Employee
- Basic Salary
- OT
- Allowances
- Gross Salary
- EPF
- SOCSO
- EIS
- Tax (PCB)
- Unpaid Leave
- Net Salary
- Employer Cost

API: `GET /reports/payroll`

### 2. Individual Yearly Payroll Summary

- Select an employee and year
- Show monthly breakdown (January–December)
- Include yearly totals

API: `GET /reports/yearly`

### 3. EPF Contribution Listing

- Monthly report

API: `GET /reports/epf`

### 4. SOCSO / EIS Contribution Listing

- Monthly report

API: `GET /reports/socso-eis`

### 5. EA Form

- Future-ready feature
- Demo: preview screen **or** “Coming Soon”
- Do **not** implement actual statutory EA generation yet

---

## Assumptions

1. Report data is derived from approved/paid payroll items; whether Draft runs appear is **TO BE CONFIRMED** (demo may include mock runs of various statuses).
2. EPF listing separates employee and employer columns.
3. SOCSO and EIS may share one combined report view as requested (“SOCSO / EIS”).
4. Yearly summary uses calendar year.
5. Filters for department/employment type are desirable but not explicitly mandated — treat as enhancement unless confirmed.

---

## Mock / demo behavior

| Report | Demo behavior |
| --- | --- |
| Monthly payroll summary | Table from mock payroll items |
| Yearly summary | Mock 12-month rows + totals for selected employee |
| EPF listing | Mock contribution rows |
| SOCSO / EIS listing | Mock contribution rows |
| EA Form | Coming Soon or static preview — non-statutory |
| Numbers | Not from live statutory engine |

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

- Whether listings must match official KWSP / PERKESO file layouts
- Exact columns for EPF and SOCSO/EIS listings beyond payroll summary fields
- Inclusion rules (which employees appear; resigned mid-year)
- EA Form layout, fields, and signing requirements
- Whether Tax column is PCB only or includes other tax items
- Employer Cost definition when Formula A vs B differs
- Access control: which roles can open each report
- Retention and regeneration after rate corrections

---

## Future backend requirements

1. Implement report queries that read payroll snapshots (not recomputed ad hoc without audit).
2. Honour contribution and overall-budget configuration when presenting Employer Cost.
3. Provide JSON for UI tables and file exports ([export-requirements.md](./export-requirements.md)).
4. Add EA generation only after statutory requirements are confirmed.
5. Support async generation for large companies if needed (job + download link) — **TO BE CONFIRMED**.
6. Notify users when monthly contribution reports are available ([notifications.md](./notifications.md)).

### Response shape (conceptual)

```json
{
  "period": { "year": 2026, "month": 9 },
  "rows": [],
  "totals": {}
}
```

Yearly:

```json
{
  "employeeId": "...",
  "year": 2026,
  "months": [],
  "totals": {}
}
```

Exact schemas **TO BE CONFIRMED** during API design.

---

## Cross-references

- Business contribution rules → [../business-rules/contributions.md](../business-rules/contributions.md)
- Payroll breakdown → [../business-rules/payroll.md](../business-rules/payroll.md)
- Exports → [export-requirements.md](./export-requirements.md)
