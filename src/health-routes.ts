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
        rel: ['health'],
        href: `${baseUrl}/health`,
        value: 'Check if the service is running'
    }];
}

const HealthResponseSchema = Type.Object({
    status: Type.String()
});
type HealthResponse = Static<typeof HealthResponseSchema>;