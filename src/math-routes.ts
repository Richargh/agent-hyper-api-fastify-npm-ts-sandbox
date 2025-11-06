import type {FastifyInstance} from "fastify";
import {type Static, Type} from "@sinclair/typebox";
import {type Link} from "./hypermedia-types.ts";

export function configureMathRoutes(server: FastifyInstance): (baseUrl: string) => Link[] {
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
        Querystring: AddQuerystring;
        Reply: AddResponse;
    }>(
        '/add', {
            schema: {
                querystring: AddQuerystringSchema,
                response: {
                    200: AddResponseSchema
                }
            }
        }, async (request) => {
            const {x, y} = request.query;

            const result = x + y;

            return {
                x,
                y,
                result
            };

        });

    return (baseUrl: string) => [{
        rel: ['multiply'],
        href: `${baseUrl}/multiply{?x,y}`,
        value: 'Multiply two numbers',
        templated: true
    }, {
        rel: ['add'],
        href: `${baseUrl}/add{?x,y}`,
        value: 'Add two numbers',
        templated: true
    }]
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

const AddQuerystringSchema = Type.Object({
    x: Type.Number(),
    y: Type.Number()
});
type AddQuerystring = Static<typeof AddQuerystringSchema>;
const AddResponseSchema = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    result: Type.Number()
});
type AddResponse = Static<typeof AddResponseSchema>;