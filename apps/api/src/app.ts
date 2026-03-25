import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  void fastify.register(AutoLoad, {
    dir: join(__dirname, '_plugins'),
    options: opts,
    forceESM: true,
    maxDepth: 8,
    ignorePattern: /.*\.test\.ts$/,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
    forceESM: true,
    maxDepth: 8,
    ignorePattern: /.*\.test\.ts$/,
  });

  fastify.register(routes);
};

export { app, options };
