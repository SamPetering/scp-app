import { useAuth } from '@clerk/react';
import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { MenuIcon } from 'lucide-react';
import { Dropdown, DropdownItem } from '@/components/Dropdown';
import { ThemeButton } from '@/components/ThemeButton';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/UserButton';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_public')({
  beforeLoad: ({ context }) => {
    if (context.auth.isSignedIn) throw redirect({ to: '/home' });
  },
  component: PublicLayout,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">page not found</p>
    </div>
  );
}

function PublicLayout() {
  const { isLoaded } = useAuth();

  const navOptions: { to: string; label: string }[] = [
    { to: '/', label: 'home' },
    { to: '/about', label: 'about' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <nav className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background px-4 py-2">
        <div className="hidden items-center gap-4 sm:flex">
          {navOptions.map(({ to, label }) => (
            <Link key={to} to={to} className="[&.active]:font-bold">
              {label}
            </Link>
          ))}
        </div>

        <Dropdown
          trigger={
            <Button variant="outline" size="icon" className="sm:hidden" aria-label="Toggle menu">
              <MenuIcon />
            </Button>
          }
        >
          {navOptions.map(({ to, label }) => (
            <DropdownItem key={to} asChild>
              <Link to={to}>{label}</Link>
            </DropdownItem>
          ))}
        </Dropdown>

        <div className={cn('ml-auto flex items-center gap-3', !isLoaded && 'inert opacity-0')}>
          <ThemeButton />
          <UserButton />
        </div>
      </nav>
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
      <footer className="flex justify-center gap-4 border-t border-border p-4">
        <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
          privacy policy
        </Link>
        <Link to="/tos" className="text-xs text-muted-foreground hover:text-foreground">
          terms of service
        </Link>
      </footer>
    </div>
  );
}
