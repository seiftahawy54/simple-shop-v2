import {FastifyRequest} from "fastify";

export type createCategoryBody = {
    name: string,
    description: string,
    isParent?: boolean,
    parentCategoryId?: string,
    picture: string
    children?: string[]
}

interface CategoryImageUploadRequest extends FastifyRequest<{
    Body: createCategoryBody
}> {
    file: {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        destination: string,
        filename: string,
        path: string,
        size: number
    },
}

export {CategoryImageUploadRequest}