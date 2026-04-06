import { formatForDisplay, RegisterableHotkey } from '@tanstack/react-hotkeys';

export const Hotkeys = {
  toggleTheme: 'Mod+Alt+T',
} as const satisfies Record<string, RegisterableHotkey>;

export type Hotkey = keyof typeof Hotkeys;

export function getHotkeyDisplay(hotkey: Hotkey) {
  return formatForDisplay(Hotkeys[hotkey]);
}
