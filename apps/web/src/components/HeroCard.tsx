import { ReactNode } from 'react';

export function HeroCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="relative z-1 w-full bg-background">
      <div className="hero-border" />
      <div className="rounded-xl bg-background">
        <div className="flex flex-col gap-3 rounded-xl bg-muted/10 px-6 py-8 text-center">
          <h1 className="text-4xl font-bold">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
