import Sequelize from "sequelize";
import { sequelize, dbconnection } from "../core/connection";
const Category = sequelize.define('Categories', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    name: { type: Sequelize.STRING },
    parent_id: { type: Sequelize.INTEGER },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
    }
});

export { Category };