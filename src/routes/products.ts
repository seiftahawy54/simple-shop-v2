import {FastifyInstance} from "fastify";
import ProductsController from '../controllers/products'
import ProductsSchema from '../validation/products.schema'

export default async (fastify: FastifyInstance) => {
    fastify.post('/', {
        // preHandler: uploader.single('picture'),
        schema: {
            ...ProductsSchema.createProductSchema,
            response: {
                201: {
                    type: 'object',
                    properties: {
                        id: {type: 'string'},
                        name: {type: 'string'},
                        description: {type: 'string'},
                        picture: {type: 'string'},
                        createdAt: {type: 'string'},
                        updatedAt: {type: 'string'},
                        categoryId: {type: 'string'},
                    },
                },
            }
        }
    }, ProductsController.create)
    fastify.get('/', ProductsController.getAll)
    fastify.get('/:id', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        name: {type: 'string'},
                        description: {type: 'string'},
                        picture: {type: 'string'},
                    },
                },
            }
        }
    }, ProductsController.getById)
    fastify.put('/:id', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: {type: 'string'},
                    description: {type: 'string'},
                    picture: {type: 'string'},
                },
            },
        }
    }, ProductsController.update)
    fastify.delete('/:id', ProductsController.deleteProduct)
    fastify.get('/category/:id', ProductsController.getProductsByCategoryId)
}
