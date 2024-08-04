import {FastifyReply, FastifyRequest} from "fastify";
import prisma from "../utils/db";
import {createProductBody} from "../../types/products";
import * as fs from "fs";
import path from "path";
import {extractMimeType} from "../utils/helpers";
import crypto from "crypto";

const create = async (req: FastifyRequest<{ Body: createProductBody }>, reply: FastifyReply) => {
    try {
        const mimeType = extractMimeType(req.body.picture);
        // Extract the image data from the Base64 string
        const data = req.body.picture.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(data, 'base64');

        // Save the image to a file
        const filename = `${crypto.randomUUID()}-${req.body.name.trim().split(' ').join('').toLowerCase()}.${mimeType}`; // Adjust as needed
        fs.writeFileSync(path.resolve('uploads', filename), buffer);

        await prisma.product.create({
            data: {
                ...req.body,
                picture: `static/${filename}`,
            }
        });

        return reply.send({
            ...req.body
        })
    } catch (e) {
        return e
    }
}

const getAll = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: {
                    include: {
                        parentCategory: true
                    }
                }
            }
        })
        return reply.send(products)
    } catch (e) {
        return e
    }
}

const getById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: req.params.id
            }
        })
        return reply.send(product)
    } catch (e) {
        return e
    }
}

const update = async (req: FastifyRequest<{
    Params: { id: string },
    Body: createProductBody
}>, reply: FastifyReply) => {
    try {
        const product = await prisma.product.update({
            where: {
                id: req.params.id
            },
            data: {
                ...req.body
            }
        })
        return reply.status(200).send(product)
    } catch (e) {
        return e
    }
}

const getProductsByCategoryId = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: req.params.id
            }
        })

        if (!products || products.length === 0) {
            return reply.status(404).send({message: 'Products not found'})
        }

        return reply.send(products)
    } catch (e) {
        return e
    }
}

const deleteProduct = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
        const product = await prisma.product.delete({
            where: {
                id: req.params.id
            }
        })
        return reply.status(200).send(product)
    } catch (e) {
        return e
    }
}

export default {
    create,
    getAll,
    getById,
    update,
    getProductsByCategoryId,
    deleteProduct
}
