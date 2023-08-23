import dotenv from 'dotenv';
dotenv.config();

export const DB_HOST = process.env.DB_HOST!;
export const DB_PORT = process.env.DB_PORT!;
export const DB_PASS = process.env.DB_PASS!;
export const DB_USERNAME = process.env.DB_USERNAME!;
export const DB_DIALECT = 'postgres';
export const DB_NAME = process.env.DB_NAME!;
export const SECRET_KEY = process.env.SECRET_KEY;
export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;