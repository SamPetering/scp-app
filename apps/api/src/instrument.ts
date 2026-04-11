import * as Sentry from '@sentry/node';
import { getEnvironment, getVariable } from './utils/env.js';

const dsn = getVariable('GLITCHTIP_DSN');

if (dsn) {
  Sentry.init({
    dsn,
    environment: getEnvironment(),
    sendDefaultPii: true,
  });
}
