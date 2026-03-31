import { createFileRoute } from '@tanstack/react-router';
import { HeroCard } from '@/components/HeroCard';
import { PageLayout } from '@/components/PageLayout';

export const Route = createFileRoute('/about')({
  component: About,
});

const STACK: { name: string; description: string; href: string }[] = [
  {
    name: 'TypeScript (end-to-end)',
    description:
      'Shared types across the monorepo mean API contracts are enforced at compile time — no runtime surprises.',
    href: 'https://www.typescriptlang.org/',
  },
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
  {
    name: 'Clerk',
    description: 'Hosted auth with prebuilt UI components and a user management dashboard.',
    href: 'https://clerk.com/',
  },
  {
    name: 'Vite',
    description: 'Instant HMR and fast builds. No configuration needed for most projects.',
    href: 'https://vite.dev/',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS that scales. Combined with shadcn/ui and a customizable theme.',
    href: 'https://tailwindcss.com/',
  },
  {
    name: 'TanStack Router',
    description:
      'Fully type-safe routing with first-class search params, loaders, and nested layouts.',
    href: 'https://tanstack.com/router/latest',
  },
  {
    name: 'TanStack Query',
    description:
      'The gold standard for async state management. Pairs perfectly with the useRequest hook for typed, validated fetches.',
    href: 'https://tanstack.com/query/latest',
  },
  {
    name: 'TanStack Table',
    description:
      'Headless, fully typed table logic. Sorting, filtering, and pagination without any UI constraints.',
    href: 'https://tanstack.com/table/latest',
  },
];

function About() {
  return (
    <PageLayout className="items-center justify-center pb-4">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <HeroCard title="About">
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

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">The stack</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {STACK.map(({ name, description, href }) => (
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
      </div>
    </PageLayout>
  );
}
