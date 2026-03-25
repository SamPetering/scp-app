import { userSchema } from '@scp-app/shared/types';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const myRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: { response: { 200: userSchema } },
    },
    (req, reply) => {
      reply.code(200).send(req.user);
    },
  );
};

export default myRoutes;
