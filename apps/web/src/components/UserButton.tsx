import { SignInButton, useAuth, useClerk, useUser } from '@clerk/react';
import { Link } from '@tanstack/react-router';
import { LogOutIcon, MoonIcon, SunIcon, UserIcon } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/Dropdown';
import { ShortcutBadge } from '@/components/ShortcutBadge';
import { Button } from '@/components/ui/button';
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

export function UserButton() {
  const { isSignedIn } = useAuth();
  const { dark, toggle } = useTheme();
  const { signOut } = useClerk();
  const Icon = dark ? SunIcon : MoonIcon;

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
        <Link to="/profile">
          <UserIcon className="size-3" />
          profile
        </Link>
      </DropdownItem>
      <DropdownItem onSelect={(e) => { e.preventDefault(); toggle(); }}>
        <Icon className="size-3" />
        toggle theme
        <ShortcutBadge className="-mr-1 ml-auto hidden sm:inline-flex" hotkey="toggleTheme" />
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem onSelect={() => signOut()}>
        <LogOutIcon className="size-3" />
        sign out
      </DropdownItem>
    </Dropdown>
  );
}
