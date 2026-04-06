import { SignInButton, useAuth, useClerk, useUser } from '@clerk/react';
import { Link } from '@tanstack/react-router';
import { LogOutIcon, MoonIcon, SunIcon, UserIcon } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/Dropdown';
import { ShortcutBadge } from '@/components/ShortcutBadge';
import { Button, buttonVariants } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

type ItemSize = 'sm' | 'md';

const itemSizeConfig = {
  sm: { icon: 'size-3.5', text: 'text-sm', padding: '' },
  md: { icon: 'size-4', text: 'text-base', padding: 'py-2.5' },
};

export function UserMenuLabel() {
  const { user } = useUser();
  return (
    <div className="px-2 py-1.5">
      <p className="font-medium">{user?.fullName}</p>
      <p className="truncate text-xs text-muted-foreground">
        {user?.primaryEmailAddress?.emailAddress}
      </p>
    </div>
  );
}

export function UserMenuToggleThemeItem({ itemSize = 'sm' }: { itemSize?: ItemSize }) {
  const { dark, toggle } = useTheme();
  const Icon = dark ? SunIcon : MoonIcon;
  const { icon, text, padding } = itemSizeConfig[itemSize];
  return (
    <Button
      variant="ghost"
      className={cn('w-full items-center justify-start font-normal', text, padding)}
      onClick={toggle}
    >
      <Icon className={icon} />
      <span>toggle theme</span>
      <ShortcutBadge className="-mr-1 ml-auto hidden sm:inline-flex" hotkey="toggleTheme" />
    </Button>
  );
}

export function UserMenuProfileItem({ itemSize = 'sm' }: { itemSize?: ItemSize }) {
  const { icon, text, padding } = itemSizeConfig[itemSize];
  return (
    <Link
      to="/profile"
      className={cn(
        buttonVariants({ variant: 'ghost', className: 'w-full justify-start font-normal' }),
        text,
        padding,
      )}
    >
      <UserIcon className={icon} />
      profile
    </Link>
  );
}

export function UserMenuSignOutItem({ itemSize = 'sm' }: { itemSize?: ItemSize }) {
  const { signOut } = useClerk();
  const { icon, text, padding } = itemSizeConfig[itemSize];
  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start font-normal', text, padding)}
      onClick={() => signOut()}
    >
      <LogOutIcon className={icon} />
      sign out
    </Button>
  );
}

export function UserButton() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button className="text-sm">sign in</Button>
      </SignInButton>
    );
  }

  return (
    <Dropdown
      trigger={
        <Button variant="outline" size="icon">
          <UserIcon />
        </Button>
      }
      align="end"
      className="w-max max-w-64"
    >
      <DropdownLabel className="font-normal">
        <UserMenuLabel />
      </DropdownLabel>
      <DropdownSeparator />
      <DropdownItem asChild>
        <UserMenuProfileItem />
      </DropdownItem>
      <DropdownItem asChild>
        <UserMenuToggleThemeItem />
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem asChild>
        <UserMenuSignOutItem />
      </DropdownItem>
    </Dropdown>
  );
}
