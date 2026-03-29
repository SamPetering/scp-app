# scp-app Web

Vite + React frontend.

## Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite
- **Routing:** TanStack Router (file-based)
- **Data fetching:** TanStack Query
- **Auth:** Clerk
- **Styling:** Tailwind CSS v4 + shadcn/ui

## Getting started

```sh
pnpm install
cp .env.example .env  # fill in values
pnpm dev
```

## Environment variables

| Variable                     | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key                       |
| `VITE_API_URL`               | API base URL (e.g. `http://localhost:3000`) |
| `VITE_SENTRY_DSN`            | Sentry DSN for error reporting (optional)   |

## Scripts

| Command        | Description                     |
| -------------- | ------------------------------- |
| `pnpm dev`     | Start Vite dev server           |
| `pnpm build`   | Type-check and build to `dist/` |
| `pnpm preview` | Preview the production build    |
| `pnpm check`   | Lint, format check, and build   |

## Deployment (Cloudflare Pages)

- **Build command:** `pnpm build`
- **Output directory:** `dist`
- Set env vars (`VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`, etc.) in the Cloudflare Pages dashboard
