import Fastify from 'fastify';
import {type ApiRootResponse, ApiRootResponseSchema} from "./hypermedia-types.ts";
import {configureMathRoutes} from "./math-routes.ts";
import {configureHealthRoute} from "./health-routes.ts";
import {makeBaseUrl} from "./url.ts";

export function configureServer() {
    const server = Fastify({
        logger: true
    });

    const mathActions = configureMathRoutes(server);
    configureHealthRoute(server);

    server.get<{
        Reply: ApiRootResponse;
    }>('/', {
        schema: {
            response: {
                200: ApiRootResponseSchema
            }
        }
    }, async (request) => {
        const baseUrl = makeBaseUrl(request);

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
                ...mathActions(baseUrl)
            ]
        };
    });

    return server;
}

