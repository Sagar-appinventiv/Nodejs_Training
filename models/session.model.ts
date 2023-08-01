import Sequelize from "sequelize";
import { sequelize, dbconnection } from "../core/connection";

const Session = sequelize.define('Sessions', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    user_id: {type: Sequelize.INTEGER},
    device_id: {type: Sequelize.STRING},
    status: {type: Sequelize.BOOLEAN},
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
    }
});
export{Session};