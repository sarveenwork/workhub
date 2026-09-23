# Backend — Authentication & Authorisation

## Purpose

Specify how Workhub will authenticate users and enforce roles once a real backend exists. The current frontend demo uses **simulated** sessions only.

---

## Confirmed client requirements

### Roles to design for

| Role | Confirmed focus |
| --- | --- |
| **Administrator / HR** | Manage employees, attendance, payroll, allowances, overtime, reports, company settings |
| **Manager** | View employees, attendance, attendance issues, payroll summaries, reports |
| **Employee** | Future-ready: check-in/out, view own attendance, payroll, payslips, notifications |

Demo prioritises Admin/HR; Employee and fine-grained Manager restrictions are future-ready.

### Sensitive data handling

Employee PII (IC/passport, bank accounts) requires permission-aware access. List views should mask sensitive fields. Complete bank information must not appear unnecessarily in tables.

---

## Assumptions

1. Email + password is a reasonable MVP login; SSO (Google/Microsoft/SAML) is optional later.
2. JWT access tokens + refresh tokens, or server sessions — final choice **TO BE CONFIRMED**.
3. HTTPS only in production.
4. One user account may link to one employee record for self-service.
5. Admin can manage users & roles from Settings (UI already planned).

---

## Mock / demo behavior

| Area | Demo behavior |
| --- | --- |
| Login | `/login` page with email/password against demo accounts; session stored in `localStorage` |
| Logout | `/logout` clears the demo session and returns to `/login` |
| Route gate | `(app)` routes wrapped in `AuthGate` — unauthenticated users redirect to login |
| Tokens | None (localStorage JSON session only) |
| RBAC | Role is stored on the demo user; UI labels change, enforcement is not production-grade |
| Password reset | Not implemented |
| Audit of who approved payroll | Simulated activity feed only |

### Demo accounts

| Email | Password | Role |
| --- | --- | --- |
| `admin@workhub.demo` | `demo123` | Administrator / HR |
| `manager@workhub.demo` | `demo123` | Manager |
| `guard@workhub.demo` | `demo123` | Employee (guard persona) |

---

## Proposed permission matrix (draft — **TO BE CONFIRMED**)

| Capability | Admin/HR | Manager | Employee |
| --- | --- | --- | --- |
| View all employees | Yes | Yes (view) | Own profile only |
| Create/edit employees | Yes | No | No |
| View full IC / bank | Yes | **TO BE CONFIRMED** | Own only / masked |
| Record any attendance | Yes | Limited TBD | Own check-in/out |
| Generate payroll | Yes | No | No |
| Approve / pay payroll | Yes | No | No |
| View payroll summaries | Yes | Yes | Own payslips |
| Run contribution reports | Yes | View TBD | No |
| Export Excel | Yes | TBD | No |
| Manage settings / rates | Yes | No | No |
| Manage users & roles | Yes | No | No |

This matrix is an **assumption** until the client confirms.

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

- Identity provider and password policy
- MFA requirements
- Session length and concurrent session rules
- Exact Manager permissions on PII and exports
- Whether employees may see employer contribution amounts
- IP allowlisting / VPN requirements
- Integration with existing company directory
- Who may transition payroll statuses

---

## Future backend requirements

1. Implement authentication endpoints (login, logout, refresh, me).
2. Attach authenticated principal to all API requests.
3. Enforce RBAC on every route in [api-requirements.md](./api-requirements.md).
4. Scope Employee role to `employeeId === self`.
5. Log authentication failures and privilege denials.
6. Encrypt secrets; never ship credentials to the frontend demo repo.
7. Support permission-aware field filtering for IC and bank account.

### Suggested future endpoints (not in the minimum confirmed list)

```text
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
GET  /users
POST /users
PUT  /users/:id
```

Exact auth routes are **TO BE CONFIRMED** but required for production.

---

## Frontend integration notes

Keep an `authService` (mock today) so swapping to real `/auth/*` does not rewrite pages. Gate routes with a permission helper that will later read claims from the backend.
