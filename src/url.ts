import type {FastifyRequest} from "fastify";

export function makeBaseUrl(request: FastifyRequest) {
    return `${request.protocol}://${request.hostname}`;
}