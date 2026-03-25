import { SignInButton, UserButton, useAuth } from '@clerk/react';
import { User } from '@scp-app/shared/types';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useGetMe } from '@/api/me';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  me: User | null;
  queryClient: QueryClient;
};

const RootLayout = () => {
  const { dark, toggle } = useTheme();
  const { isSignedIn } = useAuth();
  const { data: me } = useGetMe();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background p-4">
        <Link to="/" className="[&.active]:font-bold">
          home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          about
        </Link>
        {me != null && (
          <Link to="/me" className="[&.active]:font-bold">
            me
          </Link>
        )}
        {me?.roles.includes('admin') && (
          <Link to="/admin" className="[&.active]:font-bold">
            admin
          </Link>
        )}
        <div className="ml-auto flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={toggle} className="cursor-pointer text-sm">
            {dark ? <SunIcon /> : <MoonIcon />}
          </Button>
          {isSignedIn ? (
            <UserButton showName />
          ) : (
            <SignInButton mode="modal">
              <Button className="cursor-pointer text-sm">sign in</Button>
            </SignInButton>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout });
