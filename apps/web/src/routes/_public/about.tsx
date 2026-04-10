import { createFileRoute } from '@tanstack/react-router';
import { HeroCard } from '@/components/HeroCard';
import { PageLayout } from '@/components/layouts/PageLayout';

export const Route = createFileRoute('/_public/about')({
  component: About,
});

const FRONTEND: { name: string; description: string; href: string }[] = [
  {
    name: 'React',
    description: 'Component-based UI with a mature ecosystem',
    href: 'https://react.dev/',
  },
  {
    name: 'Vite',
    description: 'Sub-second HMR and fast production builds',
    href: 'https://vite.dev/',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility classes co-located with markup',
    href: 'https://tailwindcss.com/',
  },
  {
    name: 'shadcn/ui',
    description: 'Copy-paste component primitives that you own',
    href: 'https://ui.shadcn.com/',
  },
  // todo: fix
  {
    name: 'TanStack',
    description: 'Router, Query, Table, Hotkeys, and Devtools',
    href: 'https://tanstack.com/',
  },
];

const BACKEND: { name: string; description: string; href: string }[] = [
  {
    name: 'Fastify',
    description: 'Low-overhead Node.js API framework with a great plugin ecosystem',
    href: 'https://fastify.dev/',
  },
  {
    name: 'Neon',
    description: 'Serverless Postgres with instant branching for dev/prod parity',
    href: 'https://neon.com/',
  },
  {
    name: 'Drizzle ORM',
    description: 'Fully typed ORM with SQL-like query API',
    href: 'https://orm.drizzle.team/',
  },
];

const PLATFORM: { name: string; description: string; href: string }[] = [
  {
    name: 'TypeScript',
    description: 'End-to-end with shared types across the entire monorepo',
    href: 'https://www.typescriptlang.org/',
  },
  {
    name: 'Zod',
    description: 'Schema validation that enforces API contracts at runtime and compile time',
    href: 'https://zod.dev/',
  },
  {
    name: 'Clerk',
    description: 'Drop in auth with a hosted user management dashboard',
    href: 'https://clerk.com/',
  },
  {
    name: 'Cloudflare Pages',
    description: 'Global edge deployment for the frontend with minimal config',
    href: 'https://pages.cloudflare.com/',
  },
  {
    name: 'Railway',
    description: 'API deployment via a simple toml config',
    href: 'https://railway.app/',
  },
];

const SECTIONS = [
  { label: 'Frontend', items: FRONTEND },
  { label: 'Backend', items: BACKEND },
  { label: 'Platform', items: PLATFORM },
];

function About() {
  return (
    <PageLayout className="items-center justify-center">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <HeroCard title="about">
          <p className="text-center text-muted-foreground">
            scp-app is a fullstack TypeScript monorepo starter built so the foundation is never the
            bottleneck. Auth, database, deployments, components, and a responsive authenticated UI
            shell — already wired up and working together. The stack is fixed and opinionated.
            That's the point.
          </p>
          <p className="text-center text-muted-foreground">
            To get started: clone the repo, create accounts for Clerk, Neon, Railway, and Cloudflare
            Pages, add your env vars, and run the init script.
          </p>
        </HeroCard>

        <div className="flex flex-col gap-8">
          {SECTIONS.map(({ label, items }) => (
            <div key={label} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">{label}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map(({ name, description, href }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer rounded-lg border bg-muted/40 px-4 py-3 transition-colors hover:bg-muted"
                  >
                    <p className="font-medium">{name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
