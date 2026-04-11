import { FastifyPluginAsync } from 'fastify';
import glitchtipTunnel from './glitchtip-tunnel.js';
import health from './health.js';
import root from './root.js';
import clerkWebhook from './webhooks/clerk.js';

const publicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(root);
  fastify.register(health);
  fastify.register(clerkWebhook);
  fastify.register(glitchtipTunnel);
};

export default publicRoutes;
