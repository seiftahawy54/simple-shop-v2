import {FastifyReply, FastifyRequest} from "fastify";
import prisma from "../utils/db";
import {createCategoryBody} from "../../types/categories";
import {Category, ParentCategory} from "@prisma/client";
import {extractMimeType} from "../utils/helpers";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const create = async (req: FastifyRequest<{
    Body: createCategoryBody
}>, reply: FastifyReply) => {
    try {
        let parentCategoryId = null;
        let itsParent: ParentCategory | null = null;
        if (!req.body.isParent && !req.body.parentCategoryId) {
            // create a root category
            return reply.status(400).send({message: 'Parent category is required'})
        }
        // create a parent category if isParent
        if (req.body.isParent) {
            let children: Category[] = []

            if ((req.body.children as string[])?.length > 9) {
                const childrenArray = (req.body.children as string[]).map(async (child) => {
                    return prisma.category.findUnique({
                        where: {
                            id: child
                        }
                    });
                })
                children = await Promise.all(childrenArray) as Category[]
            }

            parentCategoryId = (await prisma.parentCategory.create({
                data: {
                    children: {
                        connect: children
                    }
                }
            })).id
        } else {
            itsParent = await prisma.parentCategory.findUnique({
                where: {
                    id: req.body.parentCategoryId
                }
            })

            if (!itsParent || !itsParent) {
                return reply.status(400).send({message: 'Parent category not found'})
            }
        }

        const mimeType = extractMimeType(req.body.picture);
        const data = req.body.picture.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(data, 'base64');

        const filename = `${crypto.randomUUID()}-${req.body.name.trim().split(' ').join('').toLowerCase()}.${mimeType}`; // Adjust as needed
        fs.writeFileSync(path.resolve('uploads', filename), buffer);

        const createdCategory = await prisma.category.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                isParent: req.body.isParent,
                picture: `static/${filename}`,
                parentCategoryId:
                    req.body.isParent ? parentCategoryId : req.body.parentCategoryId,
            },
        });

        // Add to children
        if (!req.body.isParent && parentCategoryId && itsParent) {
            const updatedParent = await prisma.parentCategory.update({
                where: {
                    id: parentCategoryId
                },
                data: {
                    children: {
                        connect: {
                            id: createdCategory.id
                        }
                    }
                }
            })

            if (!updatedParent) {
                return reply.status(400).send({message: 'Parent category not found'})
            }
        }

        return reply.send(createdCategory)
    } catch (e) {
        return e
    }
}

const getAll = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isParent: true,
                parentCategoryId: {
                    not: null,
                }
            },
            include: {
                parentCategory: {
                    include: {
                        children: {
                            where: {
                                isParent: false
                            }
                        }
                    }
                }
            }
        });

        if (!categories) {
            return reply.status(404).send({message: 'Categories not found'})
        }

        return reply.send({
            categories,
        })
    } catch (e) {
        return e
    }
}

const getById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id: req.params.id
            },
            select: {
                id: true,
                name: true,
                description: true,
                picture: true,
                parentCategoryId: true,
                isParent: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        if (!category) {
            return reply.status(404).send({message: 'Category not found'})
        }

        return reply.send(category)
    } catch (e) {
        return e
    }
}

const update = async (req: FastifyRequest<{
    Params: { id: string },
    Body: createCategoryBody
}>, reply: FastifyReply) => {
    try {
        const product = await prisma.category.update({
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

const addProductToCategory = async (req: FastifyRequest<{
    Params: { id: string },
    Body: { productId: string }
}>, reply: FastifyReply) => {
    try {
        const product = await prisma.category.update({
            where: {
                id: req.params.id
            },
            data: {
                products: {
                    connect: {
                        id: req.body.productId
                    }
                }
            }
        })
        return reply.status(200).send(product)
    } catch (e) {
        return e
    }
}

const deleteCategory = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
        const isExistingCategory = await prisma.category.findUnique({
            where: {
                id: req.params.id
            }
        })

        if (!isExistingCategory) {
            return reply.status(404).send({message: 'Category not found'})
        }

        const products = await prisma.product.findMany({
            where: {
                categoryId: req.params.id
            }
        })

        if (products.length > 0) {
            return reply.status(400).send({message: 'Category has products'})
        }

        const category = await prisma.category.delete({
            where: {
                id: req.params.id
            }
        })
        return reply.status(200).send(category)
    } catch (e) {
        return e
    }
}

export default {
    create,
    getAll,
    getById,
    update,
    addProductToCategory,
    deleteCategory
}
