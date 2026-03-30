import { roleSchema, userSchema } from '@scp-app/shared/types';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { getAllUsers, setUserRoles } from '../../../db/index.js';

const users: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    '/users',
    {
      schema: { response: { 200: userSchema.array() } },
    },
    async (_req, reply) => {
      const users = await getAllUsers();
      reply.code(200).send(users);
    },
  );

  fastify.patch(
    '/users/:id/roles',
    {
      schema: {
        params: z.object({ id: z.coerce.number() }),
        body: z.object({ roles: roleSchema.array() }),
        response: { 200: userSchema },
      },
    },
    async (req, reply) => {
      const updated = await setUserRoles(req.params.id, req.body.roles);
      reply.code(200).send(updated);
    },
  );
};

export default users;
