import {FastifySchema} from "fastify";

const createProductSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            name: {type: 'string', minLength: 3},
            description: {type: 'string', minLength: 3},
            categoryId: {type: 'string', minLength: 3},
            picture: {type: 'string'},
        },
        required: ['name', 'description', 'categoryId', 'picture'],
    },
}

export default {
    createProductSchema
}