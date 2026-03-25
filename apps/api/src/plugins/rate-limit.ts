import rateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
});
