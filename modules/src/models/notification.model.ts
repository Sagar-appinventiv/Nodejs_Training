import Sequelize from 'sequelize';
import { sequelize } from '../database/dbConnection';

const Notification = sequelize.define('notification', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
})
// Notification.sync({ alter: true })

export { Notification };

