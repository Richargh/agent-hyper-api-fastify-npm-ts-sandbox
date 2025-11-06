import assert from "node:assert";
import type {LightMyRequestResponse} from "fastify";

export function assertBadRequest(response: LightMyRequestResponse, message: RegExp){
    assert.strictEqual(response.statusCode, 400);
    const body = response.json();
    assert.partialDeepStrictEqual(body, {
        statusCode: 400,
        error: 'Bad Request',
        code: 'FST_ERR_VALIDATION'
    });
    assert.match(body.message, message);
}