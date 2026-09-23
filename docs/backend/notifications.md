# Backend — Notifications

## Purpose

Define in-app (and future channel) notifications for Workhub. The demo includes a notification centre with mock data; delivery integrations are not real yet.

---

## Confirmed client requirements

### Product capability

Users must be able to **receive application notifications**.

### Notification centre features

Support:

- Unread count
- Read / unread state
- Notification categories
- Timestamp

### Example notification content (from client brief)

- Payroll is ready for review
- 3 employees were absent today
- Employee submitted leave
- Payroll approved
- Monthly contribution report available

### Navigation

A **Notifications** item is part of the primary application navigation.

---

## Assumptions

1. Notifications are per-user (Admin/HR and Manager receive operational alerts; Employee receives own items in future).
2. Categories such as `payroll`, `attendance`, `leave`, `reports`, `system` are sufficient for the demo.
3. Clicking a notification navigates to a relevant screen (payroll detail, attendance today, etc.).
4. Retention of read notifications is finite (e.g. 90 days) — **TO BE CONFIRMED**.
5. Email/SMS/WhatsApp are out of scope for the demo and optional later.

---

## Mock / demo behavior

| Area | Demo behavior |
| --- | --- |
| Data | Seeded list with mixed read/unread items |
| Unread badge | Derived from mock store |
| Mark read | Updates local/mock state only |
| Push / email / SMS / WhatsApp | Not implemented |
| Real-time | No websocket; refresh on navigation or polling mock |

API today: conceptual `GET /notifications` via `notificationService`.

---

## Suggested data model

| Field | Description |
| --- | --- |
| id | Unique id |
| userId | Recipient |
| category | payroll / attendance / leave / reports / system |
| title | Short title |
| body | Optional detail |
| readAt | Null if unread |
| createdAt | Timestamp |
| href / entityRef | Deep link metadata |
| severity | info / warning — optional |

---

## Future API requirements

Confirmed minimum:

```text
GET /notifications
```

Recommended additions (**TO BE CONFIRMED**):

```text
POST /notifications/:id/read
POST /notifications/read-all
GET  /notifications/unread-count
```

Server-side creation is triggered by domain events, for example:

| Event | Example notification |
| --- | --- |
| Payroll generated | Payroll is ready for review |
| Daily attendance job | N employees were absent today |
| Leave request created | Employee submitted leave |
| Payroll approved | Payroll approved |
| Contribution report ready | Monthly contribution report available |
| Export ready (async) | Your Excel export is ready |

---

## Items requiring client confirmation (`TO BE CONFIRMED`)

- Which roles receive which categories
- Email / SMS / WhatsApp requirements and providers
- Quiet hours / digest vs immediate alerts
- Mandatory vs dismissible notifications
- Retention and archival
- Localization (EN/MS)
- Mobile push for future employee app

---

## Future backend requirements

1. Persist notifications and unread counts per user.
2. Emit notifications from payroll engine, attendance jobs, and report/export jobs.
3. Enforce that users only see their own notifications.
4. Provide mark-read APIs and optional real-time delivery (SSE/WebSocket) later.
5. Never send PII (full IC/bank) in notification bodies.
6. Integrate channel fan-out only after client confirms external messaging.

---

## Frontend guidance

- Implement a notification centre UI with category filters and unread badge.
- Route through `notificationService` so replacing mocks with `GET /notifications` is straightforward.
- Keep copy professional and actionable; deep-link where mock routes exist.

---

## Cross-references

- Product modules → [../product-overview.md](../product-overview.md)
- Payroll events → [payroll-engine.md](./payroll-engine.md)
- Report availability → [reports.md](./reports.md)
- Export completion → [export-requirements.md](./export-requirements.md)
