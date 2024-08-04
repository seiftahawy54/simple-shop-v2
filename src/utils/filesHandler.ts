import FastifyMulter from "fastify-multer";
import path from "node:path";

const uploader = FastifyMulter({
    storage: FastifyMulter.diskStorage({
        destination: path.resolve('uploads'),
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    }),
    // dest: path.resolve('uploads'),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default uploader
