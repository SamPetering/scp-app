import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import { getEnvironment } from '../utils/env.js';

const ALLOWED_ORIGINS: string[] = [
  // TODO: add production origin e.g. 'https://scp-app.com'
  'https://scp-app.samuel-petering.workers.dev',
];

export default fp(async (fastify) => {
  fastify.register(cors, {
    origin: getEnvironment() === 'dev' ? true : ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
});
