import { FastifyPluginAsync } from 'fastify';
import privateRoutes from './private/index.js';
import publicRoutes from './public/index.js';

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(publicRoutes);
  fastify.register(privateRoutes);
};

export default routes;
