import { createFileRoute } from '@tanstack/react-router';
import { HeroCard } from '@/components/HeroCard';
import { PageLayout } from '@/components/layouts/PageLayout';

export const Route = createFileRoute('/_public/about')({
  component: About,
});

const FRONTEND: { name: string; description: string; href: string }[] = [
  {
    name: 'React',
    description: 'The UI layer everything else builds on.',
    href: 'https://react.dev/',
  },
  {
    name: 'Vite',
    description: 'Instant HMR and fast builds.',
    href: 'https://vite.dev/',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first css. Simply the best way to write styles.',
    href: 'https://tailwindcss.com/',
  },
  {
    name: 'shadcn/ui',
    description: 'Copy-paste component primitives.',
    href: 'https://ui.shadcn.com/',
  },
  {
    name: 'TanStack',
    description: 'Router, Query, Table, Hotkeys, and Devtools. All hail Tanner.',
    href: 'https://tanstack.com/',
  },
];

const BACKEND: { name: string; description: string; href: string }[] = [
  {
    name: 'Fastify',
    description: 'Fast, low-overhead Node.js API framework with a great plugin ecosystem.',
    href: 'https://fastify.dev/',
  },
  {
    name: 'Neon',
    description: 'Serverless Postgres with instant branching — great for dev/prod parity.',
    href: 'https://neon.com/',
  },
  {
    name: 'Drizzle ORM',
    description: 'Lightweight, fully typed ORM. SQL-like syntax that stays close to the database.',
    href: 'https://orm.drizzle.team/',
  },
];

const PLATFORM: { name: string; description: string; href: string }[] = [
  {
    name: 'TypeScript',
    description:
      'End-to-end, from the database to the UI. Shared types across the entire monorepo.',
    href: 'https://www.typescriptlang.org/',
  },
  {
    name: 'Zod',
    description:
      'Schema validation on both ends — API contracts enforced at runtime and compile time.',
    href: 'https://zod.dev/',
  },
  {
    name: 'Clerk',
    description: 'Hosted auth with prebuilt UI components and a user management dashboard.',
    href: 'https://clerk.com/',
  },
  {
    name: 'Cloudflare Pages',
    description: 'Global edge deployment for the frontend. Fast, free, and minimal config.',
    href: 'https://pages.cloudflare.com/',
  },
  {
    name: 'Railway',
    description:
      'Deploys the API via a simple toml config. Simple, predictable, and easy to scale.',
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
            scp-app is a fullstack TypeScript monorepo template. Rather than spending the first days
            of a new project wiring up auth, a database, deployments, and a component library, this
            template has all of that ready to go — opinionated but easy to adapt.
          </p>
          <p className="text-center text-muted-foreground">
            The goal is a stack that stays out of your way: end-to-end type safety, a great
            developer experience, and zero-friction deployments. Clone it, run the init script, and
            start building the thing that actually matters.
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
                    className="rounded-lg border bg-muted/40 px-4 py-3 transition-colors hover:bg-muted"
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
