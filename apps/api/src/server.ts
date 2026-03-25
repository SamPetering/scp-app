import './instrument.js';
import * as Sentry from '@sentry/node';
import Fastify from 'fastify';
import { app, options } from './app.js';
import { requireVariable } from './utils/env.js';

async function startServer() {
  const fastify = Fastify({
    logger: true,
  });

  try {
    await fastify.register(app, options);
    Sentry.setupFastifyErrorHandler(fastify);
    const port = Number(requireVariable('PORT'));
    const host = requireVariable('HOST');
    await fastify.listen({ port, host });

    const shutdown = async () => {
      try {
        await fastify.close();
        await Sentry.close(2000);
        console.log('Server shut down gracefully');
        process.exit(0);
      } catch (e) {
        console.error('Error during shutdown:', e);
        process.exit(1);
      }
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }
}

startServer();
