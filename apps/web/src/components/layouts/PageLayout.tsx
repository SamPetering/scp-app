import { cn } from '@/lib/utils';

export function PageLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={cn('flex flex-1 flex-col p-4 sm:p-8', className)}>{children}</main>;
}
