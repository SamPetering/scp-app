# scp-app API

Fastify REST API.

## Stack

- **Runtime:** Node.js + TypeScript (tsx for dev, tsgo for build)
- **Framework:** Fastify with Zod schema validation
- **Auth:** Clerk
- **Database:** Neon (serverless Postgres) + Drizzle ORM

## Getting started

```sh
pnpm install
cp .env.example .env  # fill in values
pnpm dev
```

## Environment variables

| Variable                | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `PORT`                  | Port to listen on — Railway injects this automatically |
| `HOST`                  | Host to bind to — must be `0.0.0.0` in production      |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key                                  |
| `CLERK_SECRET_KEY`      | Clerk secret key                                       |
| `CLERK_WEBHOOK_SECRET`  | Clerk webhook signing secret                           |
| `DATABASE_URL`          | Neon database connection string                        |
| `SENTRY_DSN`            | Sentry DSN for error reporting                         |

## Scripts

| Command                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `pnpm dev`             | Start dev server with hot reload               |
| `pnpm build`           | Compile to `dist/`                             |
| `pnpm start`           | Run compiled output                            |
| `pnpm test`            | Run tests                                      |
| `pnpm check`           | Run type + lint + fmt checks and tests         |
| `pnpm db:generate`     | Generate a migration from schema changes       |
| `pnpm db:migrate`      | Apply migrations (dev, uses drizzle-kit CLI)   |
| `pnpm db:migrate:remote` | Apply migrations against a remote Neon DB over HTTP (used by Railway; drizzle-kit CLI doesn't work remotely) |

## Deployment

Hosted on Railway, deploying automatically on push to `main`.

**Deploy sequence:**

1. Build: `pnpm install --frozen-lockfile && pnpm build`
2. Pre-deploy: `pnpm db:migrate:remote` — runs pending migrations via `dist/db/migrate.js`
3. Start: `pnpm start`

Railway injects `PORT` automatically. `HOST` must be set to `0.0.0.0` in the Railway service's environment variables or the healthcheck fails. The healthcheck hits `GET /health` — if it doesn't respond within 5 minutes Railway rolls back the deploy.

`pnpm db:migrate:remote` uses drizzle-orm's migrate function directly over HTTP rather than the drizzle-kit CLI, which uses a WebSocket transport that doesn't work reliably on Railway.

## Error reporting

Errors are sent to Sentry via `@sentry/node`. Sentry is initialized in `src/instrument.ts` before the server starts.
