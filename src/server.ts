import Fastify from 'fastify';
import {type Static, Type} from '@sinclair/typebox';
import {type ApiRootResponse, ApiRootResponseSchema} from "./hypermedia-types.ts";
import {configureMathRoutes} from "./math-routes.ts";

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

    configureMathRoutes(server);

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

const HealthResponseSchema = Type.Object({
    status: Type.String()
});
type HealthResponse = Static<typeof HealthResponseSchema>;
