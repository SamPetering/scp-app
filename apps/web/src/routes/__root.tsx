import { useAuth } from '@clerk/react';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet, useMatches } from '@tanstack/react-router';
import { MenuIcon } from 'lucide-react';
import { getMeQueryOptions } from '@/api/me';
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
import { cn } from '@/lib/utils';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    hideFooter?: boolean;
  }
}

type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  queryClient: QueryClient;
};

const RootLayout = () => {
  const { isLoaded } = useAuth();
  const { data: me } = useGetMe();
  const matches = useMatches();
  const hideFooter = matches.some((m) => m.staticData?.hideFooter);

  const navOptions: { to: string; label: string }[] = [
    { to: '/', label: 'home' },
    { to: '/about', label: 'about' },
    ...(isLoaded ? [{ to: '/me', label: 'me' }] : []),
    ...(me?.roles.includes('admin') ? [{ to: '/admin', label: 'admin' }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <nav className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background p-4">
        <div className="hidden items-center gap-4 sm:flex">
          {navOptions.map(({ to, label }) => (
            <Link key={to} to={to} className="[&.active]:font-bold">
              {label}
            </Link>
          ))}
        </div>

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

        <div className={cn('ml-auto flex items-center gap-3', !isLoaded && 'inert opacity-0')}>
          <ThemeButton />
          <UserButton />
        </div>
      </nav>
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
      {!hideFooter && (
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

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  loader: ({ context: { auth, queryClient } }) => {
    queryClient.prefetchQuery(getMeQueryOptions(auth.getToken));
  },
});
