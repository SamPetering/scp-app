import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DropdownProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: React.ComponentProps<typeof DropdownMenuContent>['align'];
  side?: React.ComponentProps<typeof DropdownMenuContent>['side'];
  className?: string;
  onCloseAutoFocus?: React.ComponentProps<typeof DropdownMenuContent>['onCloseAutoFocus'];
};

export function Dropdown({
  trigger,
  children,
  align,
  side,
  className,
  onCloseAutoFocus,
}: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={className}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export {
  DropdownMenuItem as DropdownItem,
  DropdownMenuLabel as DropdownLabel,
  DropdownMenuSeparator as DropdownSeparator,
} from '@/components/ui/dropdown-menu';
