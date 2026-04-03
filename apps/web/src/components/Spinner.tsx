import { LoaderCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircleIcon className={cn('size-4 animate-spin text-muted-foreground', className)} />
  );
}
