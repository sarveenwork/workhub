# Product Overview — Workhub

## Summary

**Workhub** is an employee management, attendance, and payroll management system for organisations that employ full-time, part-time, and contract workers. The product focuses on day-to-day workforce operations and Malaysian payroll visibility (salary, overtime, allowances, deductions, and statutory contributions such as EPF, SOCSO, EIS, and PCB), with reporting and Excel export as core admin workflows.

This repository currently ships a **frontend demo**: a polished Admin/HR experience backed by mock data and mock services. A real backend is **not** implemented.

---

## Confirmed client requirements

### Product purpose

Administrators and managers must be able to:

- Manage employees and employment information
- Track attendance (check-in / check-out)
- Track overtime
- Track allowances
- Track unpaid leave / absence
- View payroll and payroll breakdowns
- View EPF / SOCSO / EIS contributions
- Generate payroll reports
- View monthly payroll summaries
- View yearly individual payroll summaries
- Export reports to Excel
- Eventually generate EA forms
- Receive application notifications

### Core user types

| Role | Confirmed capability focus |
| --- | --- |
| **Administrator / HR** | Manage employees, attendance, payroll, allowances, overtime, reports, company settings |
| **Manager** | View employees, attendance, attendance issues, payroll summaries, reports |
| **Employee** | Future-ready: check-in/out, view attendance, payroll, payslips, notifications |

For this demo phase, the **Admin/HR dashboard** is prioritised.

### Employment types

- Full-time
- Part-time
- Contract

### Employee statuses

- Active
- On Leave
- Resigned
- Suspended

### Employee record fields (supported in product design)

Employee ID, full name, IC / passport number, bank name, bank account number, join date, resign date, employment type, department, position, basic salary, allowances, status, profile photo/avatar, contact information, emergency contact, notes.

> Fields are not all assumed mandatory unless required for a specific UI flow. Mandatory field sets are **TO BE CONFIRMED**.

### Modules (product surface)

1. **Dashboard** — KPIs, attendance overview, payroll overview, recent activity, quick actions  
2. **People** — Employees, departments, positions  
3. **Attendance** — Today view, attendance records, leave  
4. **Payroll** — Overview, monthly payroll, history, detail/breakdown  
5. **Reports** — Payroll summary, EPF, SOCSO/EIS, yearly summary, EA form (future-ready)  
6. **Notifications** — In-app notification centre  
7. **Settings** — Company, payroll/attendance/contribution configuration, users & roles  

### Payroll status workflow

Confirmed statuses to support:

`Draft` → `Pending Review` → `Approved` → `Paid`

### Malaysian statutory context

The product must accommodate Malaysian payroll concepts:

- EPF (Employees Provident Fund)
- SOCSO (Social Security Organisation)
- EIS (Employment Insurance System)
- PCB (Potongan Cukai Bulanan / monthly tax deduction)
- EA forms (annual employer statement)

Exact rates, brackets, and submission mechanics are **not** confirmed for implementation — see [contributions.md](./business-rules/contributions.md).

---

## Assumptions

The following are product/UX assumptions for the demo, not confirmed payroll policy:

1. Primary language of the UI is English; currency displayed as **RM**.
2. One company / tenant context is sufficient for the demo (multi-tenant SaaS is future).
3. Admin session is simulated (no real login provider).
4. Departments and positions are simple lookup lists suitable for filters and employee assignment.
5. “Today” on the attendance dashboard uses the viewer’s local date for demonstration.
6. Charts and KPI cards use aggregated mock data sized for a company of ~30+ employees.
7. Permission differences between Admin and Manager are shown with UI placeholders where useful; full RBAC is backend work.
8. Employee self-service screens may exist as future-ready shells; they are not the demo’s primary path.

---

## Mock / demo behavior

| Area | Demo behavior |
| --- | --- |
| Data | Realistic Malaysian names, mixed employment types, departments, salaries, attendance, OT, allowances |
| Services | `src/services` call mock implementations; no network APIs |
| Auth | Soft-gated UI; no real credentials, tokens, or SSO |
| Payroll numbers | Precomputed / mocked breakdowns — **not** live statutory math |
| Check-in / check-out | Client-side mock state only; no geolocation or biometrics |
| Exports | Export buttons present; downloads may be mock/demo files |
| Notifications | Seeded in-app list with read/unread state |
| EA Form | Preview or “Coming Soon” — not statutory generation |
| Sensitive data | IC and bank accounts masked in tables (e.g. `******-**-1234`, `**** **** 4821`) |

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

- Exact overall budget formula when employer contributions differ by employee/company configuration ([payroll.md](./business-rules/payroll.md))
- Which employer contributions are always included in overall cost
- Exact EPF, SOCSO, EIS, and PCB rates / calculation methods
- Rounding rules for salary and contributions
- Salary proration for mid-month join/resign
- Standard working hours and late thresholds
- Rest day and public holiday pay rules
- Part-time and contract pay calculation methods
- Unpaid leave deduction formula
- OT approval process
- When PO/PPO/RG use RM60 vs RM65 per additional shift
- Payroll cutoff date and payment date
- EA Form field/layout requirements
- Mandatory vs optional employee fields
- Multi-company / multi-branch needs
- Notification delivery channels beyond in-app (email, SMS, WhatsApp)

---

## Future backend requirements

When production begins, the backend must provide:

- Persistent employee, attendance, payroll, report, and notification storage
- Authentication and role-based authorisation
- Authoritative payroll calculation engine (no browser-side statutory authority)
- Configurable contribution and OT rate tables
- Report generation and Excel export
- Audit trails for payroll approve/pay actions
- API contract aligned with [api-requirements.md](./backend/api-requirements.md)

See the `/docs/backend/` documents for detailed requirements.

---

## Out of scope for the current frontend demo

Do **not** expect the demo to include:

- Real backend or database
- Real authentication
- Real API integrations
- Real payroll processing
- Real EPF / SOCSO / EIS calculations
- Real Malaysian statutory submission
- Real email / SMS / WhatsApp integrations
- Real server-side Excel generation (authoritative)
- Real biometric or location-validated check-in

---

## Success criteria for the demo

A reviewing client should be able to navigate Workhub and understand:

> “Workhub lets me manage my workers, see who came to work, calculate/view payroll, monitor contributions, and generate reports.”

The UI should look production-ready. The calculations and integrations should remain clearly mock until the backend is built against these documents.
