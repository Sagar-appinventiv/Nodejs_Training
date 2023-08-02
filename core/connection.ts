const { Sequelize } = require("sequelize");
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.dbName,process.env.appName,process.env.PASSWORD,{
    hostName: process.env.hostName,
    dialect: process.env.dialect
});

const dbconnection = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established');
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database');
        
    }
}

export {sequelize,dbconnection}