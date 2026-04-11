import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_GLITCHTIP_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tunnel: `${import.meta.env.VITE_API_URL}/tunnel`,
    environment: import.meta.env.MODE,
    sendDefaultPii: true,
  });
}
