import { MoonIcon, SunIcon } from 'lucide-react';
import { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeButton({
  children,
  onClick,
  size = 'icon',
  variant = 'outline',
  ...buttonProps
}: ComponentProps<typeof Button>) {
  const { dark, toggle } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        toggle();
        onClick?.(e);
      }}
      {...buttonProps}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
      {children}
    </Button>
  );
}
