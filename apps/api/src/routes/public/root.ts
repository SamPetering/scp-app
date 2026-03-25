import { FastifyPluginAsync } from 'fastify';

const ASCII_ART = `
  ███████╗ ██████╗██████╗      █████╗ ██████╗ ██╗
  ██╔════╝██╔════╝██╔══██╗    ██╔══██╗██╔══██╗██║
  ███████╗██║     ██████╔╝    ███████║██████╔╝██║
  ╚════██║██║     ██╔═══╝     ██╔══██║██╔═══╝ ██║
  ███████║╚██████╗██║         ██║  ██║██║     ██║
  ╚══════╝ ╚═════╝╚═╝         ╚═╝  ╚═╝╚═╝     ╚═╝
`;

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (_req, reply) => {
    reply.type('text/html').send(
      `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
        </head>
        <body style="background:#0a0a0a;margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
            <pre style="color:#e2c97e;font-family:monospace;font-size:14px;line-height:1.4;">${ASCII_ART}</pre>
        </body>
        </html>`,
    );
  });
};

export default root;
