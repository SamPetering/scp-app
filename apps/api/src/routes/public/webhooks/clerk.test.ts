import { createHmac } from 'node:crypto';
import Fastify from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as usersDb from '../../../db/index.js';
import clerkWebhook from './clerk.js';

vi.mock('../../../db/index.js', () => ({
  getUser: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

const TEST_SECRET = 'whsec_dGVzdHNlY3JldGZvcnRlc3Rpbmd3ZWJob29r';
process.env.CLERK_WEBHOOK_SECRET = TEST_SECRET;

function sign(payload: object) {
  const body = JSON.stringify(payload);
  const msgId = 'msg_test';
  const timestamp = Math.floor(Date.now() / 1000);
  const secret = Buffer.from(TEST_SECRET.replace('whsec_', ''), 'base64');
  const signature = createHmac('sha256', secret)
    .update(`${msgId}.${timestamp}.${body}`)
    .digest('base64');
  return {
    body,
    headers: {
      'content-type': 'application/json',
      'svix-id': msgId,
      'svix-timestamp': String(timestamp),
      'svix-signature': `v1,${signature}`,
    },
  };
}

async function buildApp() {
  const fastify = Fastify();
  await fastify.register(clerkWebhook);
  await fastify.ready();
  return fastify;
}

describe('POST /webhooks/clerk', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await buildApp();
  });

  it('returns 400 for invalid signature', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/webhooks/clerk',
      headers: {
        'svix-id': 'msg_test',
        'svix-timestamp': String(Math.floor(Date.now() / 1000)),
        'svix-signature': 'v1,invalidsignature',
        'content-type': 'application/json',
      },
      payload: JSON.stringify({ type: 'user.created', data: {} }),
    });
    expect(res.statusCode).toBe(400);
  });

  describe('user.created', () => {
    const payload = {
      type: 'user.created',
      data: {
        id: 'user_123',
        primary_email_address_id: 'email_1',
        email_addresses: [{ id: 'email_1', email_address: 'test@example.com' }],
        first_name: 'Test',
        last_name: 'User',
      },
    };

    it('creates user when not existing', async () => {
      vi.mocked(usersDb.getUser).mockResolvedValue(undefined);
      const res = await app.inject({ method: 'POST', url: '/webhooks/clerk', ...sign(payload) });
      expect(res.statusCode).toBe(200);
      expect(usersDb.createUser).toHaveBeenCalledWith({
        clerkId: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('skips createUser when user already exists', async () => {
      vi.mocked(usersDb.getUser).mockResolvedValue({ id: 1 } as any);
      const res = await app.inject({ method: 'POST', url: '/webhooks/clerk', ...sign(payload) });
      expect(res.statusCode).toBe(200);
      expect(usersDb.createUser).not.toHaveBeenCalled();
    });

    it('returns 400 when no primary email', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/webhooks/clerk',
        ...sign({
          type: 'user.created',
          data: { ...payload.data, email_addresses: [], primary_email_address_id: 'missing' },
        }),
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('user.updated', () => {
    it('calls updateUser with new data', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/webhooks/clerk',
        ...sign({
          type: 'user.updated',
          data: {
            id: 'user_123',
            primary_email_address_id: 'email_1',
            email_addresses: [{ id: 'email_1', email_address: 'new@example.com' }],
            first_name: 'New',
            last_name: 'Name',
          },
        }),
      });
      expect(res.statusCode).toBe(200);
      expect(usersDb.updateUser).toHaveBeenCalledWith('user_123', 'new@example.com', 'New Name');
    });
  });

  describe('user.deleted', () => {
    it('calls deleteUser', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/webhooks/clerk',
        ...sign({ type: 'user.deleted', data: { id: 'user_123' } }),
      });
      expect(res.statusCode).toBe(200);
      expect(usersDb.deleteUser).toHaveBeenCalledWith('user_123');
    });
  });
});
