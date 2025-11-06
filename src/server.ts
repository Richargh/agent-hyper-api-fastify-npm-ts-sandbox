import Fastify, {type FastifyInstance} from 'fastify';
import {type ApiRootResponse, ApiRootResponseSchema, type Link} from "./hypermedia-types.ts";
import {configureMathRoutes} from "./math-routes.ts";
import {configureHealthRoutes} from "./health-routes.ts";
import {makeBaseUrl} from "./url.ts";

export function configureServer() {
    const server = Fastify({
        logger: true
    });

    const mathActions = configureMathRoutes(server);
    const healthActions = configureHealthRoutes(server);
    configureRootRoute(server, (baseUrl: string) => [
        ...healthActions(baseUrl),
        ...mathActions(baseUrl)
    ]);

    server.setErrorHandler((error, request, reply) => {
        if (error.validation) {
            // Customize validation error response
            const response = {
                status: 'error',
                message: 'Validation failed',
                errors: error.validation.map(err => ({
                    ...(err.instancePath.slice(1) === "" ? {} : {field: err.instancePath.slice(1)}),
                    message: err.message
                }))
            }
            reply.status(400).send(response)
        } else {
            // Handle other types of errors
            reply.send(error)
        }
    })

    return server;
}

function configureRootRoute(server: FastifyInstance, actions: (baseUrl: string) => Link[]) {
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
            actions: actions(baseUrl)
        };
    });
}

