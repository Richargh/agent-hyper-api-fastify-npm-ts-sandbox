import Fastify from 'fastify';
import {type Static, Type} from '@sinclair/typebox';

export function configureServer() {
    const server = Fastify({
        logger: true
    });

    server.get<{
        Reply: ApiRootResponse;
    }>('/', {
        schema: {
            response: {
                200: ApiRootResponseSchema
            }
        }
    }, async (request) => {
        const baseUrl = `${request.protocol}://${request.hostname}`;

        return {
            self: {
                rel: ['self'],
                href: `${baseUrl}/`,
                value: 'Richargh API root - lists available endpoints',
            },
            actions: [
                {
                    rel: ['multiply'],
                    href: `${baseUrl}/multiply?x={x}&y={y}`,
                    value: 'Multiply two numbers',
                    templated: true,
                },
                {
                    rel: ['health'],
                    href: `${baseUrl}/health`,
                    value: 'Health check endpoint'
                }
            ]
        };
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

const LinkSchema = Type.Object({
    rel: Type.Array(Type.String()),
    href: Type.String(),
    value: Type.String(),
    templated: Type.Optional(Type.Boolean()),
});

const ApiRootResponseSchema = Type.Object({
    self: LinkSchema,
    actions: Type.Array(LinkSchema)
});
type ApiRootResponse = Static<typeof ApiRootResponseSchema>;