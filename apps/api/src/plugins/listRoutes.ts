// oxlint-disable no-console
import fp from 'fastify-plugin';
import { getEnvironment } from '../utils/env.js';

export default fp(async (fastify) => {
  if (getEnvironment() === 'dev') {
    fastify.addHook('onReady', () => {
      console.log('Registered routes');
      const routes = fastify.printRoutes();
      console.log(routes);
    });
  }
});
