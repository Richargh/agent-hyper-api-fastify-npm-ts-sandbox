import Fastify from 'fastify';
import {type Static, Type} from '@sinclair/typebox';

export function configureServer() {
    const server = Fastify({
        logger: true
    });

    server.get<{
        Querystring: MultiplyQuerystring;
        Reply: MultiplyResponse;
    }>(
        '/multiply', {
            schema: {
                querystring: MultiplyQuerystringSchema,
                response: {
                    200: MultiplyResponseSchema
                }
            }
        }, async (request) => {
            const {x, y} = request.query;

            const result = x * y;

            return {
                x,
                y,
                result
            };

        });

    server.get<{
        Reply: HealthResponse;
    }>('/health', {
        schema: {
            response: {
                200: HealthResponseSchema
            }
        }
    }, async () => {
        return {status: 'ok'};
    });

    return server;
}

const MultiplyQuerystringSchema = Type.Object({
    x: Type.Number(),
    y: Type.Number()
});
type MultiplyQuerystring = Static<typeof MultiplyQuerystringSchema>;

const MultiplyResponseSchema = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    result: Type.Number()
});
type MultiplyResponse = Static<typeof MultiplyResponseSchema>;

const HealthResponseSchema = Type.Object({
    status: Type.String()
});
type HealthResponse = Static<typeof HealthResponseSchema>;