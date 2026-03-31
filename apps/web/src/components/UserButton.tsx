import { SignInButton, useAuth, useClerk, useUser } from '@clerk/react';
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserButton() {
  const { isSignedIn } = useAuth();
  const { openUserProfile, signOut } = useClerk();
  const { user } = useUser();

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button className="text-sm">sign in</Button>
      </SignInButton>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max max-w-64">
        <DropdownMenuLabel className="font-normal">
          <p className="font-medium">{user?.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openUserProfile()}>
          <SettingsIcon />
          manage account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon />
          sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
