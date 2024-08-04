const createCategoriesSchema = {
    body: {
        type: 'object',
        properties: {
            name: {type: 'string'},
            description: {type: 'string'},
            isParent: {type: 'boolean'},
            parentCategoryId: {type: 'string'},
            picture: {type: 'string'},
            children: {type: 'array', items: {type: 'string'}}
        },
        required: ['name', 'description', 'picture'],
    },
    file: {
        type: 'object',
        properties: {
            picture: {type: 'string'},
        }
    }
}

export default {
    createCategoriesSchema
}