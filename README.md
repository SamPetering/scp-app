# scp-app

Fullstack monorepo template — Fastify API + Vite/React frontend.

## Requirements

| Tool                                        | Install                                                                      | Notes                                               |
| ------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| [Node.js](https://nodejs.org) v20+          | `nvm install 20` ([nvm](https://www.nvmnode.com/guide/installation-sh.html)) | JavaScript runtime                                  |
| [pnpm](https://pnpm.io)                     | `curl -fsSL https://get.pnpm.io/install.sh \| sh -`                          | Faster, more disk-efficient alternative to npm/yarn |
| [GitHub CLI](https://cli.github.com) (`gh`) | `brew install gh`                                                            | Used for the one-liner repo create + push           |
| [ngrok](https://ngrok.com) _(optional)_     | `brew install ngrok`                                                         | Only needed to test Clerk webhooks locally          |

## Structure

```
apps/
  api/        # Fastify REST API
  web/        # Vite + React frontend
packages/
  shared/     # Shared types (Zod)
```

## Stack

- **Package manager:** pnpm workspaces
- **API:** Node.js + TypeScript, Fastify, Drizzle ORM, Neon (Postgres), Clerk auth
- **Web:** Vite, React, TypeScript
- **Deployment:** API → Railway, Web → Cloudflare Pages

## Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `pnpm dev`       | Start API and web dev servers                |
| `pnpm dev:api`   | Start the API dev server                     |
| `pnpm dev:web`   | Start the web dev server                     |
| `pnpm build`     | Build all apps                               |
| `pnpm fmt`       | Format all files with oxfmt                  |
| `pnpm fmt:check` | Check formatting without writing             |
| `pnpm check`     | Run type + lint + fmt checks across all apps |

See [`apps/api`](apps/api/README.md) and [`apps/web`](apps/web/README.md) for more detail.

---

## Migrations

Migrations are managed with Drizzle Kit. Schema files live in `apps/api/src/db/schema/`.

**Local development**

After changing the schema, generate a migration file and apply it to your local (`dev` branch) database:

```sh
cd apps/api
pnpm db:generate   # generates a new migration file in apps/api/drizzle/
pnpm db:migrate    # applies pending migrations using DATABASE_URL from .env
```

Commit the generated migration files alongside your schema changes.

> **Production**
> Migrations run automatically on every Railway deploy via the `preDeployCommand` in `railway.toml` (`pnpm db:migrate:remote`). This runs the compiled migrator against whatever Neon branch `DATABASE_URL` points to in your Railway environment before the new server starts. You do not need to run migrations manually in production.

---

## Setup guide

### 1. Create external services

**Clerk**

Clerk has separate dev and production instances with different keys (`pk_test_...` vs `pk_live_...`). Use the dev instance for local development and create a production instance when deploying.

1. Go to [clerk.com](https://clerk.com) and create an application — this creates your dev instance.
2. Copy your dev API keys — you'll need them in step 2:
   - Publishable key (`pk_test_...`)
   - Secret key (`sk_test_...`)
3. If you have social login providers enabled (e.g. Google), you'll need to set up your own OAuth credentials for the production instance — see step 3.

**Neon**

Neon supports branch-based environments. Use `main` for production and a `dev` branch for local development so you can experiment freely without touching production data.

1. Go to [neon.com](https://neon.com) and create a project.
2. In the Neon dashboard, create a `dev` branch from `main`.
3. Copy the connection string for the `dev` branch — you'll use it locally in step 2. The `main` branch connection string is for production in step 4.

**Sentry** _(optional)_

1. Go to [sentry.io](https://sentry.io) and create a Node.js project and a Browser (React) project.
2. Copy both DSNs — you'll need them in steps 2 and 4.

---

### 2. Clone and init locally

```sh
git clone https://github.com/SamPetering/scp-app my-project
cd my-project
node scripts/init.js
```

The init script will:

1. Prompt for a project name (kebab-case)
2. Replace all occurrences of `scp-app` with your project name across the repo
3. Delete `pnpm-lock.yaml` so it is regenerated with the new package names
4. Copy `apps/api/.env.example` → `apps/api/.env` and `apps/web/.env.example` → `apps/web/.env`
5. Run `pnpm install` and `pnpm fmt`
6. Self-delete (`scripts/init.js` is removed when done)

Create a new GitHub repo and push:

```sh
gh repo create my-project --private --source=. --remote=origin --push
```

Or manually: create a repo on GitHub, then:

```sh
git remote set-url origin https://github.com/you/my-project
git push -u origin main
```

Fill in your env files with **development** values (Clerk dev instance, Neon dev branch, etc.). Production values are set directly in Railway and Cloudflare Pages — there is no separate `.env.production` file.

**`apps/api/.env`**

| Variable                | Value                                     |
| ----------------------- | ----------------------------------------- |
| `CLERK_PUBLISHABLE_KEY` | Clerk dev publishable key (`pk_test_...`) |
| `CLERK_SECRET_KEY`      | Clerk dev secret key (`sk_test_...`)      |
| `CLERK_WEBHOOK_SECRET`  | Leave blank for now — see step 5          |
| `DATABASE_URL`          | Neon `dev` branch connection string       |
| `SENTRY_DSN`            | Sentry Node.js DSN _(optional)_           |

**`apps/web/.env`**

| Variable                     | Value                                     |
| ---------------------------- | ----------------------------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk dev publishable key (`pk_test_...`) |
| `VITE_API_URL`               | `http://localhost:3000`                   |
| `VITE_SENTRY_DSN`            | Sentry browser DSN _(optional)_           |

Then run:

```sh
pnpm dev
```

**Grant yourself admin (optional)**

Sign in to the app locally at least once so your user is synced to the database, then run the following in the [Neon SQL editor](https://console.neon.tech) against your `dev` branch:

```sql
INSERT INTO users_role (user_id, role)
SELECT id, 'admin'
FROM users
WHERE email = 'you@example.com';
```

Once you have admin access, you can grant other users admin from `/admin/users` in the app.

---

### 3. Set up Clerk for production

1. In the Clerk dashboard, switch to your production instance.
2. Under **Configure → Domains**, add your domain and add the DNS records Clerk provides to Cloudflare. Set all Clerk DNS records to **DNS only (grey cloud)** — proxying them will break Clerk.
3. If you have social login providers enabled (e.g. Google), go to **Configure → SSO Connections** and add your own OAuth credentials for each provider. Clerk uses shared credentials in development but requires your own in production.
4. Copy your production API keys (`pk_live_...`, `sk_live_...`) — you'll need them in step 4.

---

### 4. Deploy to Railway and Cloudflare Pages

**Railway (API)**

1. Go to [railway.app](https://railway.app), create a new project, and connect your Git repository.
2. Add environment variables to the Railway service:

   | Variable                | Value                                |
   | ----------------------- | ------------------------------------ |
   | `NODE_ENV`              | `production`                         |
   | `HOST`                  | `0.0.0.0`                            |
   | `CLERK_PUBLISHABLE_KEY` | `pk_live_...`                        |
   | `CLERK_SECRET_KEY`      | `sk_live_...`                        |
   | `CLERK_WEBHOOK_SECRET`  | Leave blank for now — see step 5     |
   | `DATABASE_URL`          | Neon `main` branch connection string |
   | `SENTRY_DSN`            | Sentry Node.js DSN _(optional)_      |

   > Railway injects `PORT` automatically — do not add it manually.

3. Add a custom domain under **Settings → Networking → Custom Domain** (e.g. `api.your-domain.com`). Railway will provide a CNAME and TXT record — add both to Cloudflare DNS as **DNS only (grey cloud)**.
4. Railway will deploy automatically on push to `main`. Build, migration, and start commands are configured in [`railway.toml`](railway.toml).

**Cloudflare Pages (web)**

1. Go to the Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect your Git repository.
2. Set the build configuration:

   | Setting                | Value                                                   |
   | ---------------------- | ------------------------------------------------------- |
   | Build command          | `pnpm --filter shared build && pnpm --filter web build` |
   | Build output directory | `apps/web/dist`                                         |
   | Root directory         | _(leave blank)_                                         |

3. Add environment variables under **Settings → Environment variables (Production)**:

   | Variable                     | Value                                              |
   | ---------------------------- | -------------------------------------------------- |
   | `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...`                                      |
   | `VITE_API_URL`               | `https://api.your-domain.com` (include `https://`) |

   > These are baked in at build time — a redeploy is required after changing them.

4. Add your frontend domain to `PROD_ORIGINS` in [`apps/api/src/plugins/cors.ts`](apps/api/src/plugins/cors.ts) and redeploy the API:

   ```ts
   const PROD_ORIGINS: string[] = ['https://your-domain.com'];
   ```

---

### 5. Configure Clerk webhooks

The API syncs users to the database on `user.created`, `user.updated`, and `user.deleted` events via `POST /webhooks/clerk`.

**Production**

In the Clerk dashboard (production instance) → **Webhooks** → **Add endpoint**:

- **URL:** `https://api.your-domain.com/webhooks/clerk`
- **Events:** `user.created`, `user.updated`, `user.deleted`

After saving, copy the **Signing Secret** and add it to your Railway environment variables:

```
CLERK_WEBHOOK_SECRET=whsec_...
```

**Local**

Use [ngrok](https://ngrok.com) to expose your local API:

```sh
ngrok http 3000
```

Add a second webhook endpoint in Clerk (dev instance) pointing to your ngrok URL, copy its signing secret into `apps/api/.env`, and restart the API.

---

### 6. Grant yourself admin

Sign in to the app at least once so your user is synced to the database, then run the following in the [Neon SQL editor](https://console.neon.tech) against your `main` branch:

```sql
INSERT INTO users_role (user_id, role)
SELECT id, 'admin'
FROM users
WHERE email = 'you@example.com';
```

Once you have admin access, you can grant other users admin from `/admin/users` in the app.
