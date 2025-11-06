import {describe, it} from 'node:test';
import assert from 'node:assert';
import Fastify from 'fastify';
import {configureHealthRoutes} from './health-routes.ts';

describe('Health Routes', () => {
    const server = Fastify();
    configureHealthRoutes(server);

    describe('GET /health', () => {
        it('should return ok status', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/health'
            });

            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.json(), {
                status: 'ok'
            });
        });
    });
});
