import {describe, it} from 'node:test';
import assert from 'node:assert';
import Fastify from 'fastify';
import {configureMathRoutes} from './math-routes.ts';
import {assertBadRequest} from "./asserts.test.ts";

describe('Math Routes', () => {
    const server = Fastify();
    configureMathRoutes(server);

    describe('GET /multiply', () => {
        it('should multiply two positive numbers', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/multiply?x=3&y=4'
            });

            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.json(), {
                x: 3,
                y: 4,
                result: 12
            });
        });

        it('should multiply negative numbers', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/multiply?x=-5&y=3'
            });

            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.json(), {
                x: -5,
                y: 3,
                result: -15
            });
        });

        it('should multiply by zero', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/multiply?x=5&y=0'
            });

            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.json(), {
                x: 5,
                y: 0,
                result: 0
            });
        });

        it('should multiply decimal numbers', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/multiply?x=2.5&y=4'
            });

            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.json(), {
                x: 2.5,
                y: 4,
                result: 10
            });
        });

        it('should reject missing x parameter', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/multiply?y=4'
            });

            assertBadRequest(response, /must have required property 'x'/);
        });

        it('should reject missing y parameter', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/multiply?x=3'
            });

            assertBadRequest(response,  /must have required property 'y'/);
        });

        it('should reject non-numeric x parameter', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/multiply?x=abc&y=4'
            });

            assertBadRequest(response, /x must be number/);
        });

        it('should reject non-numeric y parameter', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/multiply?x=3&y=xyz'
            });

            assertBadRequest(response, /y must be number/);
        });

        it('should reject missing both parameters', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/multiply'
            });

            assertBadRequest(response,/must have required property/);
        });
    });

    describe('GET /add', () => {
        it('should add two positive numbers', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/add?x=3&y=202'
            });

            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.json(), {
                x: 3,
                y: 202,
                result: 205
            });
        });

        it('should add negative numbers', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/add?x=-10&y=-5'
            });

            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.json(), {
                x: -10,
                y: -5,
                result: -15
            });
        });

        it('should add positive and negative numbers', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/add?x=10&y=-3'
            });

            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.json(), {
                x: 10,
                y: -3,
                result: 7
            });
        });

        it('should add decimal numbers', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/add?x=1.5&y=2.7'
            });

            assert.strictEqual(response.statusCode, 200);
            const result = response.json();
            assert.partialDeepStrictEqual(response.json(), {
                x: 1.5,
                y: 2.7
            });
            assert.ok(Math.abs(result.result - 4.2) < 0.0001);
        });

        it('should reject missing x parameter', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/add?y=5'
            });

            assertBadRequest(response, /must have required property 'x'/);
        });

        it('should reject missing y parameter', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/add?x=10'
            });

            assertBadRequest(response, /must have required property 'y'/);
        });

        it('should reject non-numeric x parameter', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/add?x=hello&y=5'
            });

            assertBadRequest(response, /x must be number/);
        });

        it('should reject non-numeric y parameter', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/add?x=10&y=world'
            });

            assertBadRequest(response, /y must be number/);
        });

        it('should reject missing both parameters', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/add'
            });

            assertBadRequest(response, /must have required property/);
        });
    });
});
