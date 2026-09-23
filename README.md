# Workhub

Frontend demo for **Workhub** — employee workforce, attendance and payroll management.

## Scope

This repository is a **frontend-only** client demo:

- Realistic UI workflows for Admin/HR
- Mock data and mock service layers
- Business rules and backend contracts documented in `/docs`

There is **no** real authentication, database, statutory payroll engine, or statutory submissions.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Recharts (dashboard charts)
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/dashboard`.

## Project structure

```
app/                 # Next.js routes (UI)
src/
  components/        # Design system + layout
  lib/               # Formatting & constants (no payroll calc)
  mocks/             # Demo datasets
  services/          # Mock API layer consumed by UI
  types/             # Domain types
docs/                # Product + business rules + backend specs
```

## Architecture

```
UI → services → mock implementation
```

Later:

```
UI → services → real API
```

Do not import mock arrays directly from page components; use services.

## Documentation

Start at [docs/README.md](docs/README.md).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
