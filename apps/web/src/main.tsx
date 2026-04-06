import './instrument.ts';
import './index.css';
import { useAuth } from '@clerk/react';
import { ClerkProvider } from '@clerk/react';
import { shadcn } from '@clerk/ui/themes';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { useHotkey } from '@tanstack/react-hotkeys';
import { hotkeysDevtoolsPlugin } from '@tanstack/react-hotkeys-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { StrictMode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { AppIcon } from '@/components/AppIcon.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { useTheme } from '@/hooks/useTheme.ts';
import { Hotkeys } from '@/lib/hotkeys.ts';
import { routeTree } from './routeTree.gen';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const { toggle } = useTheme();
  useHotkey(Hotkeys.toggleTheme, toggle);
  useEffect(() => {
    if (!auth.isLoaded) return;
    router.invalidate();
  }, [auth.isSignedIn, auth.isLoaded]);

  if (!auth.isLoaded)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
        <div className="flex animate-pulse flex-col items-center justify-center rounded-full bg-primary p-4">
          <AppIcon className="size-8 text-chart-1" />
        </div>
      </div>
    );

  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider appearance={{ theme: shadcn }} publishableKey={PUBLISHABLE_KEY}>
          <TooltipProvider>
            <InnerApp />
          </TooltipProvider>
        </ClerkProvider>
        <TanStackDevtools
          plugins={[
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel router={router} />,
            },
            hotkeysDevtoolsPlugin(),
          ]}
        />
      </QueryClientProvider>
    </StrictMode>,
  );
}
