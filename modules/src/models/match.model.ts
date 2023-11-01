import Sequelize from 'sequelize';
import { sequelize } from '../database/dbConnection';

const Match = sequelize.define('match', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
        unique: true,
    },
    matchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
});

export {Match};