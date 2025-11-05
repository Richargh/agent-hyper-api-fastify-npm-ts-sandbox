import {configureServer} from "./server.ts";

async function start(){
    const server = configureServer();
    try {
        await server.listen({ port: 4000, host: '0.0.0.0' });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

start();
