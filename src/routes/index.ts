import {FastifyInstance} from "fastify";
import ProductsRoutes from './products'
import CategoriesRoutes from './categories'

export default async (fastify: FastifyInstance) => {
    fastify.register(ProductsRoutes, {
        prefix: '/products',
    })
    fastify.register(CategoriesRoutes, {
        prefix: '/categories',
    })
}