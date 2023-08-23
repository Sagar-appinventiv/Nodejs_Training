import { Sequelize } from "sequelize";
import { DB_NAME, DB_USERNAME, DB_PASS, DB_HOST, DB_DIALECT } from "./config";
import dotenv from 'dotenv';

dotenv.config();

export const sequelize: any = new Sequelize(DB_NAME, DB_USERNAME, DB_PASS, {
    host: DB_HOST,
    dialect: DB_DIALECT
});

export const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('------- Connected Successfully -------');
    } catch (error) {
        console.error('!!! Unable to connect to database :', error);
    }
}