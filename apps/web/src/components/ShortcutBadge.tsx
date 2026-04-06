import { Kbd } from '@/components/ui/kbd';
import { getHotkeyDisplay, Hotkey as HotkeyType } from '@/lib/hotkeys';
import { cn } from '@/lib/utils';

export function ShortcutBadge({ hotkey, className }: { hotkey: HotkeyType; className?: string }) {
  return <Kbd className={cn('h-fit pt-[0.2rem]', className)}>{getHotkeyDisplay(hotkey)}</Kbd>;
}
