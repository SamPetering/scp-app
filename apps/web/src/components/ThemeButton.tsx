import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeButton() {
  const { dark, toggle } = useTheme();

  return (
    <Button variant="outline" size="icon" onClick={toggle} className="text-sm">
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
