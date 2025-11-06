import type {FastifyInstance} from "fastify";
import {type Static, Type} from "@sinclair/typebox";

export function configureMathRoutes(server: FastifyInstance) {
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