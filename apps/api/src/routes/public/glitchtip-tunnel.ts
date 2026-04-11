/**
 * Proxies Sentry envelopes from the browser to GlitchTip, bypassing ad blockers
 * that block requests to known error-tracking hosts. Validates the envelope DSN
 * against WEB_GLITCHTIP_DSN to prevent use as an open proxy.
 *
 * When using the Sentry tunnel option, the SDK omits X-Sentry-Auth and expects
 * the server to construct it from the DSN.
 */
import { FastifyPluginAsync } from 'fastify';
import { getVariable } from '../../utils/env.js';

const glitchtipTunnel: FastifyPluginAsync = async (fastify) => {
  fastify.addContentTypeParser(
    'application/x-sentry-envelope',
    { parseAs: 'string', bodyLimit: 200_000 },
    (_req, body, done) => done(null, body),
  );

  fastify.post('/tunnel', async (request, reply) => {
    const dsn = getVariable('WEB_GLITCHTIP_DSN');
    if (!dsn) {
      return reply.status(503).send({ error: 'Tunnel not configured' });
    }

    const body = request.body as string;

    let envelopeDsn: string;
    try {
      envelopeDsn = JSON.parse(body.split('\n')[0]).dsn;
    } catch {
      return reply.status(400).send({ error: 'Invalid envelope' });
    }

    if (envelopeDsn.trim() !== dsn.trim()) {
      return reply.status(403).send({ error: 'DSN mismatch' });
    }

    const url = new URL(dsn);
    const envelopeUrl = `${url.protocol}//${url.host}/api/${url.pathname.slice(1)}/envelope/`;

    const response = await fetch(envelopeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${url.username}`,
      },
      body,
    });

    return reply.status(response.status).send(await response.text());
  });
};

export default glitchtipTunnel;
