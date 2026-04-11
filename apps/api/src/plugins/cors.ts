import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import { getEnvironment } from '../utils/env.js';

const PROD_ORIGINS: string[] = ['https://scp-app.dev'];
const STAGING_ORIGINS: string[] = [];

const getOrigins = () => {
  const env = getEnvironment();
  if (env === 'development') return true;
  if (env === 'staging') return STAGING_ORIGINS;
  if (env === 'production') return PROD_ORIGINS;
  return [];
};

export default fp(async (fastify) => {
  fastify.register(cors, {
    origin: getOrigins(),
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
});
