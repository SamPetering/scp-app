import { getAuth } from '@clerk/fastify';
import { User } from '@scp-app/shared/types';
import { FastifyPluginAsync } from 'fastify';
import { findOrCreateUser } from '../../db/index.js';
import adminRoutes from './admin/index.js';
import myRoutes from './me/index.js';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}

const privateRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (req, reply) => {
    const { userId } = getAuth(req);
    if (!userId) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
    req.user = await findOrCreateUser(userId);
  });

  fastify.register(myRoutes, { prefix: '/me' });
  fastify.register(adminRoutes, { prefix: '/admin' });
};

export default privateRoutes;
