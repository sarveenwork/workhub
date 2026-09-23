# Business Rules — Contributions

## Purpose

Document Malaysian statutory **contribution** concepts in Workhub: EPF, SOCSO, and EIS for both employee and employer sides, and how employer portions relate to **overall budget**.

> Exact rates, brackets, and wage-base rules are **TO BE CONFIRMED**. This document must not invent statutory tables.

---

## Confirmed client requirements

### Contribution types in scope

Workhub must allow viewing (and eventually calculating/reporting):

- **EPF** — Employees Provident Fund  
- **SOCSO** — Social Security Organisation  
- **EIS** — Employment Insurance System  

Related tax deduction **PCB** is an employee deduction (see [deductions.md](./deductions.md)), not an employer contribution, but appears alongside contributions in payroll and reports.

### Payroll visibility

Payroll detail must show:

- Employee deductions for EPF / SOCSO / EIS (and PCB, unpaid leave)
- Employer contributions for EPF / SOCSO / EIS
- Overall employer cost influenced by employer contribution configuration

### Overall budget and employer contributions

Two client-stated formulas exist. Employer contribution inclusion is a critical configuration point.

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

### Configuration status

> **TO BE CONFIRMED WITH CLIENT**

Whether a company (or individual employee) uses Formula A, Formula B, or another variant must be confirmed. Do not assume one universal rule in production code.

### Reports

Client requires contribution listings:

- Monthly **EPF Contribution Listing**
- Monthly **SOCSO / EIS Contribution Listing**

See [../backend/reports.md](../backend/reports.md).

### EA forms

Eventually generate EA forms (annual). Demo is future-ready only (preview / Coming Soon). Statutory EA rules are **TO BE CONFIRMED**.

---

## Assumptions

1. Demo payslips show separate employee vs employer columns/sections for EPF, SOCSO, EIS.
2. Mock employer cost uses contribution fields that exist on the mock payroll item, without asserting Formula A or B as policy.
3. Contribution configuration settings screens exist as UI shells for future rate tables.
4. Reporting months align with payroll run months.

---

## Mock / demo behavior

| Area | Demo behavior |
| --- | --- |
| Rates | Placeholder RM amounts — **not** KWSP/PERKESO official figures |
| Formula A vs B | Documented; UI may show employer cost as a single mock total |
| Settings | Contribution configuration page edits mock display values only |
| Submissions | No real filing to KWSP, PERKESO, or LHDN |
| EA Form | Non-authoritative preview or Coming Soon |

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

| Topic | Status |
| --- | --- |
| Employer contribution set for overall budget (A vs B vs configurable) | **TO BE CONFIRMED WITH CLIENT** |
| Exact EPF employee & employer rates | **TO BE CONFIRMED** |
| Exact SOCSO employee & employer rates | **TO BE CONFIRMED** |
| Exact EIS employee & employer rates | **TO BE CONFIRMED** |
| Wage base definition (what counts as contributory wages) | **TO BE CONFIRMED** |
| Age-based or category-based contribution differences | **TO BE CONFIRMED** |
| Foreign worker / special category handling | **TO BE CONFIRMED** |
| Rounding conventions | **TO BE CONFIRMED** |
| Contribution payment / remittance dates | **TO BE CONFIRMED** |
| Report column layout for statutory listings | **TO BE CONFIRMED** |
| EA Form field mapping | **TO BE CONFIRMED** |

---

## Future backend requirements

1. Maintain versioned contribution rate tables effective by date.
2. Calculate employee and employer portions during payroll generation.
3. Apply the confirmed overall-budget configuration when computing employer cost.
4. Produce EPF and SOCSO/EIS listing reports and exports.
5. Support future statutory submission integrations (out of scope for demo).
6. Keep audit logs for rate changes and payroll recalculations.

API surfaces: `GET /reports/epf`, `GET /reports/socso-eis`, payroll detail endpoints — see [api-requirements.md](../backend/api-requirements.md).

---

## Separation of concerns (implementers)

| Concept | Document |
| --- | --- |
| Employee EPF/SOCSO/EIS + PCB + unpaid leave | [deductions.md](./deductions.md) |
| Employer EPF/SOCSO/EIS + overall budget | This file + [payroll.md](./payroll.md) |
| Calculation engine | [../backend/payroll-engine.md](../backend/payroll-engine.md) |

Never collapse employee deductions and employer contributions into a single ambiguous “EPF” figure in APIs or exports without clear side indicators (`employee` vs `employer`).
