# Business Rules — Allowances

## Purpose

Describe allowance types currently supported by Workhub, how allowances appear in payroll, and how the model stays extensible for future allowance categories.

---

## Confirmed client requirements

### Currently supported allowance types

- **Petrol Allowance**
- **Management Allowance**

### Extensibility

The allowance system must be designed so future allowance types can be added without restructuring the product.

Possible future types (not confirmed as currently used):

- Housing
- Meal
- Travel
- Phone
- Other

### Allowance record shape (product design)

Each allowance should support attributes such as:

| Attribute | Description |
| --- | --- |
| Type | Allowance category (Petrol, Management, …) |
| Amount | Monetary value (RM) |
| Frequency | How often it applies (e.g. monthly) — exact enum **TO BE CONFIRMED** |
| Effective Date | When the allowance starts |
| Status | Active / inactive (exact statuses **TO BE CONFIRMED**) |

### Payroll presentation

Allowances appear as separate earnings lines in payroll breakdowns, for example:

- Petrol Allowance — RM 200 (example only)
- Management Allowance — RM 500 (example only)

They contribute to:

```text
Salary (Basic + OT / Allowance)
```

in overall budget formulas (see [payroll.md](./payroll.md)).

### Employee profile

Employee profiles include an **Allowances** tab for viewing (and eventually managing) assigned allowances.

---

## Assumptions

1. Demo allowances are primarily **monthly** recurring amounts.
2. An employee may have zero, one, or multiple active allowances.
3. Allowance amounts in the demo are fixed mock values, not prorated mid-month.
4. “Management Allowance” is available to selected roles/positions in mock data only — eligibility rules TBD.
5. Settings may list allowance types as a simple catalogue for demo configuration.

---

## Mock / demo behavior

| Area | Demo behavior |
| --- | --- |
| Types | Petrol and Management populated in mocks; other types may appear as disabled/future options |
| Amounts | Static mock RM values |
| CRUD | UI may allow editing mock allowance assignments without server persistence |
| Statutory treatment | Not calculated — whether allowance is EPF-subject is not decided in demo math |
| Frequency | Displayed as “Monthly” in most seed data |

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

| Topic | Notes |
| --- | --- |
| Eligibility rules per allowance type | Who receives Petrol vs Management |
| Frequency options | Monthly, daily, per shift, one-off |
| Proration on join/resign | Method TBD |
| Taxable vs non-taxable treatment | PCB impact TBD |
| Inclusion in EPF / SOCSO / EIS wage base | Statutory TBD |
| Approval workflow for new allowances | TBD |
| Caps / maximums | Company policy |
| Ability for managers vs HR to edit | RBAC |
| Exact status lifecycle | Active, Ended, Suspended, etc. |
| Future types to enable first | Housing, Meal, Travel, Phone, Other |

---

## Future backend requirements

The backend must:

1. Persist allowance types (catalogue) and employee allowance assignments.
2. Version amounts by effective date for historical payroll correctness.
3. Feed active allowances into payroll generation for the period.
4. Expose allowance data via employee and payroll APIs.
5. Allow configuration of new types without code changes where possible (data-driven catalogue).

Suggested conceptual entities: `AllowanceType`, `EmployeeAllowance`, linked to `PayrollItem` lines of category `allowance`.

---

## Cross-references

- Payroll earnings structure → [payroll.md](./payroll.md)
- Contributions wage base questions → [contributions.md](./contributions.md)
- Database entities → [../backend/database-requirements.md](../backend/database-requirements.md)
