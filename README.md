# Simple Shop

- This project about creating a demo project for Simple Shop System:

## Project Requirements

- That helps in List All Products, and Categories.
- Create, Update, and Delete Products and Categories.
- Provide an Endpoint for the UI to utilize.
- Using Prisma for database operations such as migration and easy modeling

## Pre-Requisites
- NodeJS >= 18.19.1
- MySQL database engine [MySQL](https://www.mysql.com/downloads/)

## Installation instructions

- Clone project : `git clone https://github.com/seiftahawy54/simple-shop.git
- Create `.env` file for environment variables : `touch .env`
- Add important variables before running the app:
    - `NODE_ENV` : to change the project environment depending on where the project will run
    - `PORT` : to publish the project to certain port.
    - `DATABASE_URL` : to allow accessing the database
    - `STATIC_URL` : to make sure that all images are uploaded and served correctly
- Install dependencies : `bun install`
    - The app will be accessible at ``http://localhost:{{PORT}}``
- **Before** start the project you need to run `bun run migrate` to run the database migration/creation instructions.
- Run the project in dev mode : `bun dev`

## Additional Resources
- Postman Collection available at `API_COLLECTION`
