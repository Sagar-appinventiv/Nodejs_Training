import Sequelize from "sequelize";
import { sequelize, dbconnection } from "../core/connection";

const User = sequelize.define('Users', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    phone_number: {
        type: Sequelize.INTEGER
    },
    status: {
        type: Sequelize.ENUM("Active", "Not Active")
    },
    DOB: {
        type: Sequelize.DATE
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
    }
});

// User.sync({alter:true});

// (async()=>{
//     await User.sync({alter:true});
//     console.log('model were sync succesfully');

// })();

export { User };