import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LeftNavLayout({
  nav,
  children,
  className,
}: {
  nav: (collapsed: boolean) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-1">
      <aside
        className={cn(
          'flex shrink-0 flex-col overflow-hidden border-r p-2 transition-all duration-200',
          collapsed ? 'min-w-12' : 'w-52',
        )}
      >
        <div className="flex flex-1 flex-col gap-1">{nav(collapsed)}</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((c) => !c)}
          className={cn('shrink-0', collapsed ? 'mx-auto' : 'ml-auto')}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </Button>
      </aside>
      <main className={cn('flex-1 overflow-auto', className)}>{children}</main>
    </div>
  );
}
