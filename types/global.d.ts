// Add process.env types

declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URL: string;
        PORT: string;
        STATIC_URL: string;
    }
}
