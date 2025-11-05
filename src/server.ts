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
            name: 'Richargh API',
            version: '1.0.0',
            description: 'A simple API for mathematical operations',
            links: [
                {
                    rel: 'self',
                    href: `${baseUrl}/`,
                    method: 'GET',
                    description: 'API root - lists available endpoints'
                },
                {
                    rel: 'multiply',
                    href: `${baseUrl}/multiply?x={x}&y={y}`,
                    method: 'GET',
                    description: 'Multiply two numbers',
                    templated: true,
                    parameters: {
                        x: { type: 'number', required: true, description: 'First number' },
                        y: { type: 'number', required: true, description: 'Second number' }
                    }
                },
                {
                    rel: 'health',
                    href: `${baseUrl}/health`,
                    method: 'GET',
                    description: 'Health check endpoint'
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

const LinkParameterSchema = Type.Object({
    type: Type.String(),
    required: Type.Boolean(),
    description: Type.String()
});

const LinkSchema = Type.Object({
    rel: Type.String(),
    href: Type.String(),
    method: Type.String(),
    description: Type.String(),
    templated: Type.Optional(Type.Boolean()),
    parameters: Type.Optional(Type.Record(Type.String(), LinkParameterSchema))
});

const ApiRootResponseSchema = Type.Object({
    name: Type.String(),
    version: Type.String(),
    description: Type.String(),
    links: Type.Array(LinkSchema)
});
type ApiRootResponse = Static<typeof ApiRootResponseSchema>;