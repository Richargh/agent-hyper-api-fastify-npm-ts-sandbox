import {type Static, Type} from "@sinclair/typebox";
import type {FastifyInstance} from "fastify";

export function configureHealthRoute(server: FastifyInstance) {
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
}

const HealthResponseSchema = Type.Object({
    status: Type.String()
});
type HealthResponse = Static<typeof HealthResponseSchema>;