import  Sequelize  from 'sequelize';
import { sequelize } from '../database/dbConnection';

const ChatModel = sequelize.define('chat', {
    senderId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false,
    },
    recieverId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false,
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

export { ChatModel };
