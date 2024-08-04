import {FastifyRequest} from "fastify";

type createProductBody = {
    name: string,
    description: string,
    categoryId: string,
    picture: string
}

interface fileType {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number
}

export {createProductBody, fileType}