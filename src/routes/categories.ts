import {FastifyInstance} from "fastify";
import CategoriesSchema from "../validation/categories.schema";
import CategoriesController from "../controllers/categories";

export default async (fastify: FastifyInstance) => {
    fastify.post('/', {
        schema: {
            ...CategoriesSchema.createCategoriesSchema,
            response: {
                201: {
                    type: 'object',
                    properties: {
                        id: {type: 'string'},
                        name: {type: 'string'},
                        description: {type: 'string'},
                        picture: {type: 'string'},
                        parentCategoryId: {type: ['string', 'null']},
                        isParent: {type: 'boolean'},
                        createdAt: {type: 'string'},
                        updatedAt: {type: 'string'},
                    },
                },
            }
        }
    }, CategoriesController.create)
    fastify.get('/', CategoriesController.getAll)
    fastify.get('/:id', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        name: {type: 'string'},
                        description: {type: 'string'},
                        picture: {type: 'string'},
                        parentCategoryId: {type: ['string', 'null']},
                        isParent: {type: 'boolean'},
                        createdAt: {type: 'string'},
                        updatedAt: {type: 'string'},
                        children: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {type: 'string'},
                                    name: {type: 'string'},
                                    description: {type: 'string'},
                                    picture: {type: 'string'},
                                    parentCategoryId: {type: ['string', 'null']},
                                    isParent: {type: 'boolean'},
                                    createdAt: {type: 'string'},
                                    updatedAt: {type: 'string'},
                                }
                            }
                        }
                    },
                },
            }
        }
    }, CategoriesController.getById)
    fastify.put('/:id', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: {type: 'string'},
                    description: {type: 'string'},
                    picture: {type: 'string'},
                    parentCategoryId: {type: ['string', 'null']},
                    isParent: {type: 'boolean'},
                },
            },
        }
    }, CategoriesController.update)
    fastify.delete('/:id', CategoriesController.deleteCategory)
    fastify.put('/add-product/:id', CategoriesController.addProductToCategory)
}
