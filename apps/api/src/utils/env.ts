// oxlint-disable no-console
export function getEnvironment() {
  return process.env.NODE_ENV === 'production'
    ? 'production'
    : process.env.NODE_ENV === 'staging'
      ? 'staging'
      : process.env.NODE_ENV === 'test'
        ? 'test'
        : 'dev';
}

console.log('NODE_ENV: ', getEnvironment());

type VariableKey =
  | 'PORT'
  | 'HOST'
  | 'CLERK_PUBLISHABLE_KEY'
  | 'CLERK_SECRET_KEY'
  | 'CLERK_WEBHOOK_SECRET'
  | 'DATABASE_URL'
  | 'SENTRY_DSN';
export function getVariable(key: VariableKey) {
  const v = process.env[key];
  if (v == null || v.trim() === '') console.warn(`Missing environment variable: ${key}`);
  return v == null ? null : v;
}
export function requireVariable(key: VariableKey) {
  const v = getVariable(key);
  if (v == null || v.trim() === '') throw new Error(`Missing environment variable: ${key}`);
  return v;
}
