import { useAuth } from '@clerk/react';
import { User } from '@scp-app/shared/types';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { MenuIcon } from 'lucide-react';
import { useGetMe } from '@/api/me';
import { ThemeButton } from '@/components/ThemeButton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserButton } from '@/components/UserButton';

type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  me: User | null;
  queryClient: QueryClient;
};

const RootLayout = () => {
  const { data: me } = useGetMe();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navOptions: { to: string; label: string }[] = [
    { to: '/', label: 'home' },
    { to: '/about', label: 'about' },
    ...(me != null ? [{ to: '/me', label: 'me' }] : []),
    ...(me?.roles.includes('admin') ? [{ to: '/admin', label: 'admin' }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <nav className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background p-4">
        {/* Desktop links */}
        <div className="hidden items-center gap-4 sm:flex">
          {navOptions.map(({ to, label }) => (
            <Link key={to} to={to} className="[&.active]:font-bold">
              {label}
            </Link>
          ))}
        </div>

        {/* Hamburger dropdown (mobile only) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="sm:hidden">
            <Button variant="outline" size="icon" aria-label="Toggle menu">
              <MenuIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {navOptions.map(({ to, label }) => (
              <DropdownMenuItem key={to} asChild>
                <Link to={to}>{label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-3">
          <ThemeButton />
          <UserButton />
        </div>
      </nav>
      <Outlet />
      {!pathname.startsWith('/admin') && (
        <footer className="flex justify-center gap-4 border-t border-border p-4">
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
            privacy policy
          </Link>
          <Link to="/tos" className="text-xs text-muted-foreground hover:text-foreground">
            terms of service
          </Link>
        </footer>
      )}
    </div>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout });
