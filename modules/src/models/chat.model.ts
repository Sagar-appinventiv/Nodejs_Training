import  Sequelize  from 'sequelize';
import { sequelize } from '../database/dbConnection';

const ChatModel = sequelize.define('chat', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    senderId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false,
    },
    receiverId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false,
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});

export { ChatModel };
