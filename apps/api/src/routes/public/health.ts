import { FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async (_req, reply) => {
    reply.code(200).send({ status: 'ok' });
  });
};

export default health;
