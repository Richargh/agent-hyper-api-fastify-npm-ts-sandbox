import {type Static, Type} from "@sinclair/typebox";
import type {FastifyInstance} from "fastify";
import type {Link} from "./hypermedia-types.ts";

export function configureHealthRoutes(server: FastifyInstance): (baseUrl: string) => Link[] {
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

    return (baseUrl: string) => [{
        rel: ['multiply'],
        href: `${baseUrl}/multiply?x={x}&y={y}`,
        value: 'Multiply two numbers',
        templated: true,
    }];
}

const HealthResponseSchema = Type.Object({
    status: Type.String()
});
type HealthResponse = Static<typeof HealthResponseSchema>;