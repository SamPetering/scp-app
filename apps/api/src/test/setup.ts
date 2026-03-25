import { vi } from 'vitest';

vi.mock('../db/index.js', () => ({
  db: {},
}));
