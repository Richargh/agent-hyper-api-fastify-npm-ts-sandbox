import Fastify, {type FastifyInstance} from 'fastify';

export function configureServer(): FastifyInstance {
    const server = Fastify({
        logger: true
    });

    server.get('/multiply', async (request, reply) => {
        const {x, y} = request.query as { x?: string; y?: string };

        if (!x || !y) {
            return reply.status(400).send({
                error: 'Both parameters "x" and "y" are required'
            });
        }

        const numX = parseFloat(x);
        const numY = parseFloat(y);

        if (isNaN(numX) || isNaN(numY)) {
            return reply.status(400).send({
                error: 'Parameters "a" and "b" must be valid numbers'
            });
        }

        const result = numX * numY;

        return {
            x: numX,
            y: numY,
            result
        };
    });

    server.get('/health', async () => {
        return {status: 'ok'};
    });

    return server;
}