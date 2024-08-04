import Fastify, {FastifyInstance} from 'fastify'
import dotenv from 'dotenv'
import multer from "fastify-multer";
import cors from '@fastify/cors'
import mySql from '@fastify/mysql';
import AllRoutes from './routes';
import fastifyStatic from "@fastify/static";
import path from "path";

dotenv.config()

console.log(`this is data  =>> `, process.env.DATABASE_URL)

const server: FastifyInstance = Fastify({
    logger: true,
})

server.register(
    cors,
    {
        origin: true
    }
)

// register mysql
server
    .register(mySql, {
        connectionString: process.env.DATABASE_URL
    });

server.register(multer.contentParser)

server.register(fastifyStatic, {
    root: path.resolve('uploads'),
    prefix: '/static',
})

server.register(AllRoutes, {
    prefix: '/api',
})

const start = async () => {
    try {
        const PORT = parseInt(<string>process.env.PORT) || 3000;
        const address = server.server.address() ? (server.server.address() as {
            address: string;
        }).address : 'localhost';
        await server.listen({port: PORT, host: "0.0.0.0"})
        console.log(`server listening on ${address}:${PORT}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
    .then(() => console.log('App started'))
    .catch(err => {
        console.log(err)
    })

export default start()
