FROM node:18.19.1-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY prisma/schema.prisma ./prisma/

RUN npx prisma generate

COPY . .

COPY ./tsconfig.json ./

RUN npm run build

CMD ["npm", "run", "start:prod"]
