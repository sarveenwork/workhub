# Backend — API Requirements

## Purpose

Define the **future backend HTTP API contract** that Workhub frontend services will call when mocks are replaced. These endpoints are **not implemented** in the current frontend demo.

Base path assumption (adjustable): `/api/v1`

Authentication: Bearer token (or session cookie) — see [authentication.md](./authentication.md).

---

## Confirmed client requirements (API surface)

The frontend should be designed so the eventual backend can expose APIs such as:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/employees` | List employees |
| `GET` | `/employees/:id` | Employee detail |
| `POST` | `/employees` | Create employee |
| `PUT` | `/employees/:id` | Update employee |
| `GET` | `/attendance` | List / query attendance |
| `POST` | `/attendance/check-in` | Record check-in |
| `POST` | `/attendance/check-out` | Record check-out |
| `GET` | `/attendance/check-ins` | List check-in requests (location, time, approval) |
| `POST` | `/attendance/check-ins/:id/approve` | Admin approve check-in |
| `POST` | `/attendance/check-ins/:id/reject` | Admin reject check-in |
| `GET` | `/payroll` | List payroll runs |
| `GET` | `/payroll/:id` | Payroll run detail |
| `POST` | `/payroll/generate` | Generate payroll |
| `POST` | `/payroll/:id/approve` | Approve payroll |
| `POST` | `/payroll/:id/pay` | Mark payroll paid |
| `GET` | `/reports/payroll` | Monthly payroll summary report |
| `GET` | `/reports/epf` | EPF contribution listing |
| `GET` | `/reports/socso-eis` | SOCSO / EIS contribution listing |
| `GET` | `/reports/yearly` | Individual yearly payroll summary |
| `GET` | `/notifications` | List notifications |

Do **not** implement these real APIs in the demo phase.

---

## Assumptions

1. JSON request/response bodies; UTF-8; amounts as decimal strings or numbers in RM.
2. List endpoints support pagination (`page`, `pageSize`), sorting, and filtering query params.
3. Error responses use a consistent shape: `{ "error": { "code": "...", "message": "..." } }`.
4. IDs are opaque strings (UUID recommended).
5. All mutating endpoints are audited server-side.
6. Additional nested resources (allowances, departments) will follow the same style; exact paths TBD.

---

## Mock / demo behavior

Frontend `src/services/*` mirror these paths conceptually but resolve against in-memory / mock data with artificial latency. No HTTP server is required for the demo.

---

## Endpoint specifications

### Employees

#### `GET /employees`

**Query (assumed):** `search`, `status`, `employmentType`, `departmentId`, `page`, `pageSize`, `sort`

**Response (conceptual):** paginated list of employee summaries (masked IC/bank in list views preferred).

#### `GET /employees/:id`

Full employee profile including employment, allowances summary, and safe sensitive fields per caller permission.

#### `POST /employees`

Create employee. Required fields **TO BE CONFIRMED**.

#### `PUT /employees/:id`

Partial or full update. Resign flows may set `resignDate` and `status`.

---

### Attendance

#### `GET /attendance`

**Query (assumed):** `date`, `from`, `to`, `employeeId`, `departmentId`, `status`, `page`, `pageSize`

Returns daily attendance rows with check-in/out, hours, OT hours, status, notes.

#### `POST /attendance/check-in`

**Body (assumed):** `{ "employeeId": "...", "timestamp": "ISO-8601", "location": { "label", "address", "latitude", "longitude" } }` (server may ignore client clock / require server-side geolocation — **TO BE CONFIRMED**)

Creates or updates today’s attendance to checked-in. For security guards, creates a check-in request pending admin approval (demo behaviour; production workflow **TO BE CONFIRMED**).

#### `POST /attendance/check-out`

**Body (assumed):** `{ "employeeId": "...", "timestamp": "ISO-8601" }`

Completes the day punch; server computes total hours per policy.

#### `GET /attendance/check-ins`

**Query (assumed):** `approvalStatus`, `date`, `employeeId`

Returns check-in requests with duty location, punch time, and approval state for admin review.

#### `POST /attendance/check-ins/:id/approve` / `reject`

**Body (assumed):** `{ "notes": "..." }`

Admin decision on a pending security-guard check-in. Effect of rejection on attendance status is **TO BE CONFIRMED**.

---

### Payroll

#### `GET /payroll`

List runs filtered by `year`, `month`, `status`.

#### `GET /payroll/:id`

Run header + employee line items or link to paginated items. Include earnings, deductions, employer contributions, net, employer cost.

#### `POST /payroll/generate`

**Body (assumed):** `{ "year": 2026, "month": 9 }`

Creates a `Draft` run using attendance, OT, allowances, and contribution configuration. Authoritative calculation only on backend.

#### `POST /payroll/:id/approve`

Transitions `Pending Review` → `Approved` (exact allowed from-states **TO BE CONFIRMED**).

#### `POST /payroll/:id/pay`

Transitions `Approved` → `Paid`. Payment file generation **TO BE CONFIRMED**.

---

### Reports

#### `GET /reports/payroll`

Monthly payroll summary columns: Employee, Basic, OT, Allowances, Gross, EPF, SOCSO, EIS, Tax, Unpaid Leave, Net, Employer Cost.

#### `GET /reports/epf`

Monthly EPF contribution listing.

#### `GET /reports/socso-eis`

Monthly SOCSO / EIS contribution listing.

#### `GET /reports/yearly`

**Query (assumed):** `employeeId`, `year` — monthly breakdown + yearly totals.

Export variants may use `Accept` headers or `/export` suffixes — see [export-requirements.md](./export-requirements.md).

---

### Notifications

#### `GET /notifications`

List for current user; support `unreadOnly`, pagination. Mark-read endpoints are expected as future additions (`POST /notifications/:id/read`, `POST /notifications/read-all`) — **TO BE CONFIRMED**.

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

- Final URL prefix and versioning scheme
- Required fields for employee create/update
- Whether check-in trusts client timestamp vs server time
- Idempotency keys for generate/approve/pay
- Pagination defaults and max page size
- Soft-delete vs hard-delete for employees
- Webhook / event stream needs
- Bulk import endpoints
- EA form download endpoint shape

---

## Future backend requirements

1. Implement the table of confirmed endpoints as the minimum viable contract.
2. Keep OpenAPI/Swagger documentation in sync with this file.
3. Version breaking changes carefully; frontend services should remain the single integration layer.
4. Enforce RBAC on every route ([authentication.md](./authentication.md)).
5. Ensure payroll mutation routes invoke the [payroll engine](./payroll-engine.md), not ad-hoc SQL math.
