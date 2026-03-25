import { FastifyPluginAsync } from 'fastify';
import { Webhook } from 'svix';
import { createUser, deleteUser, getUser, updateUser } from '../../../db/index.js';
import { requireVariable } from '../../../utils/env.js';

type EmailAddress = { id: string; email_address: string };

type UserCreatedEvent = {
  type: 'user.created';
  data: {
    id: string;
    primary_email_address_id: string;
    email_addresses: EmailAddress[];
    first_name: string | null;
    last_name: string | null;
  };
};

type UserUpdatedEvent = {
  type: 'user.updated';
  data: {
    id: string;
    primary_email_address_id: string;
    email_addresses: EmailAddress[];
    first_name: string | null;
    last_name: string | null;
  };
};

type UserDeletedEvent = {
  type: 'user.deleted';
  data: { id: string };
};

type ClerkEvent = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;

const clerkWebhook: FastifyPluginAsync = async (fastify) => {
  fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, (_req, body, done) => {
    done(null, body);
  });

  fastify.post('/webhooks/clerk', async (req, reply) => {
    const wh = new Webhook(requireVariable('CLERK_WEBHOOK_SECRET'));

    let event: ClerkEvent;
    try {
      event = wh.verify(req.body as Buffer, {
        'svix-id': req.headers['svix-id'] as string,
        'svix-timestamp': req.headers['svix-timestamp'] as string,
        'svix-signature': req.headers['svix-signature'] as string,
      }) as ClerkEvent;
    } catch {
      return reply.code(400).send({ error: 'Invalid signature' });
    }

    if (event.type === 'user.created') {
      const { id, email_addresses, primary_email_address_id, first_name, last_name } = event.data;
      const email = email_addresses.find((e) => e.id === primary_email_address_id)?.email_address;
      if (!email) return reply.code(400).send({ error: 'No primary email' });
      const name = [first_name, last_name].filter(Boolean).join(' ');
      const existing = await getUser(id);
      if (!existing) await createUser({ clerkId: id, email, name });
    } else if (event.type === 'user.updated') {
      const { id, email_addresses, primary_email_address_id, first_name, last_name } = event.data;
      const email = email_addresses.find((e) => e.id === primary_email_address_id)?.email_address;
      if (!email) return reply.code(400).send({ error: 'No primary email' });
      const name = [first_name, last_name].filter(Boolean).join(' ');
      await updateUser(id, email, name);
    } else if (event.type === 'user.deleted') {
      await deleteUser(event.data.id);
    }

    return reply.code(200).send();
  });
};

export default clerkWebhook;
