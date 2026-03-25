import { FastifyPluginAsync } from 'fastify';
import users from './users.js';

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (req, reply) => {
    if (!req.user?.roles.includes('admin')) {
      reply.code(403).send({ error: 'Forbidden' });
      return;
    }
  });

  fastify.register(users);
};

export default adminRoutes;
