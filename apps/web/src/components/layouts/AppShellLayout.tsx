import { useAuth } from '@clerk/react';
import { Link, useRouterState } from '@tanstack/react-router';
import { MenuIcon, PanelLeftIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppIcon } from '@/components/AppIcon';
import { Tooltip } from '@/components/Tooltip';
import { Button, buttonVariants } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  UserButton,
  UserMenuLabel,
  UserMenuProfileItem,
  UserMenuSignOutItem,
  UserMenuToggleThemeItem,
} from '@/components/UserButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { PageLayout } from './PageLayout';

export type NavItem = {
  to: string;
  label: string;
  exact?: boolean;
};

export type NavSection = NavItem & {
  icon: React.ElementType;
} & {
  items: NavItem[];
};

export type ItemSize = 'sm' | 'md';

const itemSizeConfig = {
  sm: { padding: 'p-2', headerPadding: 'p-2.5', text: 'text-sm', icon: 'size-3' },
  md: { padding: 'p-3', headerPadding: 'p-3.5', text: 'text-base', icon: 'size-4' },
};

function NavLink({
  to,
  exact,
  icon,
  label,
  className,
  itemSize = 'sm',
}: NavItem & {
  icon?: React.ElementType;
  className?: string;
  itemSize?: ItemSize;
}) {
  const Icon = icon ?? 'div';
  const { padding, text, icon: iconSize } = itemSizeConfig[itemSize];
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className={cn(
        'flex items-center gap-2 rounded-md',
        padding,
        text,
        'text-muted-foreground transition-colors',
        className,
      )}
    >
      <Icon className={cn(iconSize, 'shrink-0')} />
      <span className={cn(text, 'leading-0')}>{label}</span>
    </Link>
  );
}

function useIsSectionActive(section: NavSection) {
  const { location } = useRouterState();
  const currentPath = location.pathname;
  return (
    currentPath === section.to ||
    section.items.some((item) =>
      item.exact ? currentPath === item.to : currentPath.startsWith(item.to),
    )
  );
}

function NavSection({
  section,
  defaultOpen,
  itemSize = 'sm',
}: {
  section: NavSection;
  defaultOpen?: boolean;
  itemSize?: ItemSize;
}) {
  const expanded = useIsSectionActive(section) || defaultOpen;
  const { headerPadding } = itemSizeConfig[itemSize];
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg hover:bg-sidebar-accent',
        expanded && 'bg-sidebar-accent',
      )}
    >
      <NavLink {...section} className={headerPadding} itemSize={itemSize} />
      {expanded && (
        <ul className="flex flex-col gap-1 p-1">
          {section.items.map((i) => (
            <NavLink
              key={i.to}
              {...i}
              itemSize={itemSize}
              className={cn(
                'hover:bg-card hover:text-foreground',
                '[&.active]:bg-card [&.active]:font-medium [&.active]:text-foreground',
              )}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function NavSectionMenu({ section }: { section: NavSection }) {
  const isActive = useIsSectionActive(section);
  return (
    <DropdownMenu>
      <Tooltip content={section.label} side="right">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'mx-auto w-fit px-3 py-2',
              'text-muted-foreground hover:bg-muted dark:hover:bg-muted',
              isActive && 'bg-muted text-foreground',
            )}
          >
            {<section.icon />}
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent side="right" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>{section.label}</DropdownMenuLabel>
        {section.items.map(({ to, label }) => (
          <DropdownMenuItem key={to} asChild>
            <Link to={to}>{label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarNav({
  sections,
  collapsed,
  defaultSectionOpen,
  itemSize = 'sm',
}: {
  sections: NavSection[];
  collapsed: boolean;
  defaultSectionOpen?: boolean;
  itemSize?: ItemSize;
}) {
  return (
    <div className={cn('flex flex-1 flex-col', collapsed ? 'gap-1' : 'gap-2')}>
      {sections.map((section) =>
        collapsed ? (
          <NavSectionMenu key={section.label} section={section} />
        ) : (
          <NavSection
            key={section.label}
            section={section}
            defaultOpen={defaultSectionOpen}
            itemSize={itemSize}
          />
        ),
      )}
    </div>
  );
}

function AppIconLink({ className, tooltip }: { className?: string; tooltip?: boolean }) {
  return (
    <Tooltip content={tooltip ? 'Home' : null} side="right">
      <Link
        to={'/home'}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon', className }),
          'text-muted-foreground',
        )}
      >
        <AppIcon />
      </Link>
    </Tooltip>
  );
}

export function AppShellLayout({
  navSections,
  children,
}: {
  navSections: NavSection[];
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();
  const [collapsed, setCollapsed] = useLocalStorage('nav-collapsed', false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar — full height */}
      <aside
        className={cn(
          'bg-sidebar transition-all duration-150',
          'hidden shrink-0 flex-col overflow-hidden border-r p-2 transition-all duration-200 sm:flex',
          collapsed ? 'w-14' : 'w-52',
        )}
        onMouseEnter={() => setSidebarActive(true)}
        onMouseLeave={() => setSidebarActive(false)}
        onFocus={() => setSidebarActive(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setSidebarActive(false);
        }}
      >
        <div className={cn('mb-2 flex', !collapsed && 'justify-between')}>
          {(!collapsed || !sidebarActive) && (
            <AppIconLink tooltip className={cn(collapsed && 'mx-auto w-fit px-3')} />
          )}

          {sidebarActive && (
            <Tooltip content={`${collapsed ? 'Expand' : 'Collapse'} navigation`} side="right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed((c) => !c)}
                className={cn(
                  'text-muted-foreground',
                  collapsed ? 'mx-auto w-fit px-3' : 'ml-auto',
                )}
              >
                <PanelLeftIcon />
              </Button>
            </Tooltip>
          )}
        </div>
        <SidebarNav sections={navSections} collapsed={collapsed} itemSize="sm" />
      </aside>

      {/* Mobile drawer */}
      <Drawer direction="right" open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent className="p-2 data-vaul-drawer:duration-150! data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:rounded-none">
          <div className="mb-2 flex justify-between">
            <AppIconLink />
            <Button onClick={() => setMobileOpen(false)} variant="ghost" size="icon">
              <XIcon className="text-muted-foreground" />
            </Button>
          </div>

          <SidebarNav sections={navSections} collapsed={false} defaultSectionOpen itemSize="md" />

          <div className="mt-auto border-t pt-2">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1 border-b pb-1">
                <UserMenuLabel />
                <UserMenuProfileItem itemSize="md" />
                <UserMenuToggleThemeItem itemSize="md" />
              </div>
              <UserMenuSignOutItem itemSize="md" />
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background p-2">
          <div className="sm:hidden">
            <AppIconLink />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto text-muted-foreground sm:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <MenuIcon />
          </Button>
          <div
            className={cn(
              'ml-auto hidden items-center gap-3 sm:flex',
              !isLoaded && 'inert opacity-0',
            )}
          >
            <UserButton />
          </div>
        </header>

        {/* app content */}
        <PageLayout className="overflow-auto">{children}</PageLayout>
      </div>
    </div>
  );
}
