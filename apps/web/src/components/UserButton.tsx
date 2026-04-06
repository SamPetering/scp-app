import { SignInButton, useAuth, useClerk, useUser } from '@clerk/react';
import { Link } from '@tanstack/react-router';
import { LogOutIcon, MoonIcon, SunIcon, UserIcon } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/Dropdown';
import { ShortcutBadge } from '@/components/ShortcutBadge';
import { Button, buttonVariants } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

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

export function UserMenuToggleThemeItem() {
  const { dark, toggle } = useTheme();
  const Icon = dark ? SunIcon : MoonIcon;
  return (
    <Button
      variant="ghost"
      className="w-full items-center justify-start font-normal"
      onClick={toggle}
    >
      <Icon className="size-3.5" />
      <span>toggle theme</span>
      <ShortcutBadge className="-mr-1 ml-auto hidden sm:inline-flex" hotkey="toggleTheme" />
    </Button>
  );
}

export function UserMenuProfileItem() {
  return (
    <Link
      to="/profile"
      className={buttonVariants({
        variant: 'ghost',
        className: 'w-full justify-start font-normal',
      })}
    >
      <UserIcon className="size-3.5" />
      profile
    </Link>
  );
}

export function UserMenuSignOutItem() {
  const { signOut } = useClerk();
  return (
    <Button variant="ghost" className="w-full justify-start font-normal" onClick={() => signOut()}>
      <LogOutIcon className="size-3.5" />
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
