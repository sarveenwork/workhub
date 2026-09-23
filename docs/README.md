# Workhub Documentation

This folder is the authoritative specification for the **Workhub** frontend demo and the future backend that will replace mock services.

Workhub is an employee workforce, attendance, and payroll management system for companies managing full-time, part-time, and contract workers in a **Malaysian employment context** (EPF, SOCSO, EIS, PCB, EA forms).

> **Scope reminder:** The current application is a **frontend demo only**. There is no real backend, database, authentication, statutory calculation engine, or submission integration. Mock values illustrate workflows; they are not authoritative payroll results.

---

## Document map

### Product

| Document | Purpose |
| --- | --- |
| [product-overview.md](./product-overview.md) | Product purpose, users, modules, demo vs production scope |

### Business rules

| Document | Purpose |
| --- | --- |
| [business-rules/payroll.md](./business-rules/payroll.md) | Salary structure, overall budget formulas, payroll workflow |
| [business-rules/attendance.md](./business-rules/attendance.md) | Attendance statuses, check-in/out, absence → unpaid leave |
| [business-rules/overtime.md](./business-rules/overtime.md) | Security guard OT formula; PO/PPO/RG shift rates |
| [business-rules/allowances.md](./business-rules/allowances.md) | Petrol & management allowances; extensible types |
| [business-rules/deductions.md](./business-rules/deductions.md) | Employee deductions including unpaid leave and PCB |
| [business-rules/contributions.md](./business-rules/contributions.md) | Employer/employee EPF, SOCSO, EIS; configuration TBD |

### Backend (future)

| Document | Purpose |
| --- | --- |
| [backend/api-requirements.md](./backend/api-requirements.md) | REST API contract the frontend services will call |
| [backend/database-requirements.md](./backend/database-requirements.md) | Entities, relationships, sensitive-field handling |
| [backend/authentication.md](./backend/authentication.md) | Auth, roles, permissions |
| [backend/payroll-engine.md](./backend/payroll-engine.md) | Authoritative calculation, approval, pay lifecycle |
| [backend/reports.md](./backend/reports.md) | Monthly, yearly, contribution, and EA form reports |
| [backend/export-requirements.md](./backend/export-requirements.md) | Excel and statutory export expectations |
| [backend/notifications.md](./backend/notifications.md) | In-app and future channel notifications |

---

## How to read these documents

Every business-rule and backend document uses the same classification. Treat labels as binding guidance for implementers and reviewers.

### 1. Confirmed client requirements

Rules or capabilities the client has explicitly stated. Implement these in UI and plan them into the backend.

### 2. Assumptions

Reasonable product/UX assumptions made so the demo can ship. Assumptions are **not** confirmed business rules. Challenge them with the client before production.

### 3. Mock / demo behavior

What the frontend does today: static/mock data, simulated workflows, placeholder rates. Never treat demo numbers as statutory or contractual truth.

### 4. Items requiring client confirmation (`TO BE CONFIRMED`)

Gaps where inventing a rule would be incorrect. Do not hard-code these into components. Capture decisions when the client confirms them.

### 5. Future backend requirements

Capabilities the eventual API, payroll engine, and database must provide. Documented so the frontend can stay service-oriented (`UI → service → mock` today; `UI → service → API` later).

---

## Critical open decisions (high priority)

These items are intentionally **not** decided in code:

| Topic | Status |
| --- | --- |
| Overall budget formula (EPF-only vs EPF + SOCSO + EIS employer) | **TO BE CONFIRMED WITH CLIENT** — both formulas documented in [payroll.md](./business-rules/payroll.md) |
| Exact EPF / SOCSO / EIS / PCB rates and brackets | **TO BE CONFIRMED** — Malaysian context only; no rates invented |
| Security Guards OT | Confirmed formula documented; calculation belongs in backend |
| PO / PPO / RG additional shift rate (RM60 vs RM65) | **TO BE CONFIRMED** — must be configurable |
| Unpaid leave salary deduction method | Rule confirmed directionally; calculation method **TO BE CONFIRMED** |
| Payroll cutoff / payment dates | **TO BE CONFIRMED** |
| EA Form generation details | Future-ready UI only |

---

## Architecture alignment

The frontend is structured so business logic is **not** embedded in presentational components:

```text
UI components
  → services (employee, attendance, payroll, report, notification)
    → mock implementations (current demo)
    → real HTTP API (future backend)
```

When replacing mocks:

1. Keep TypeScript domain types stable under `src/types`.
2. Implement the endpoints in [api-requirements.md](./backend/api-requirements.md).
3. Move calculation authority to the [payroll engine](./backend/payroll-engine.md).
4. Update these docs when client confirmations change a rule.

---

## Related repository notes

- Application name: **Workhub**
- Stack (demo): Next.js + React + TypeScript
- Currency presentation: Malaysian Ringgit (RM)
- Sensitive fields (IC, bank account) should remain masked in list UIs even in the demo

For product intent and module list, start with [product-overview.md](./product-overview.md).
