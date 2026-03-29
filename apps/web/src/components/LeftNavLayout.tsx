import { cn } from '@/lib/utils';

export function LeftNavLayout({
  nav,
  children,
  className,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-1">
      <aside className="flex w-52 shrink-0 flex-col gap-1 border-r p-3">{nav}</aside>
      <main className={cn('flex-1 overflow-auto', className)}>{children}</main>
    </div>
  );
}
