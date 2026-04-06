import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function Tooltip({
  children,
  content,
  side,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'left' | 'top' | 'right' | 'bottom';
}) {
  if (content == null) return children;
  return (
    <UITooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </UITooltip>
  );
}
