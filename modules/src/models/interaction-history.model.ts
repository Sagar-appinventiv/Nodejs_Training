import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConnection';

const InteractionHistory = sequelize.define('InteractionHistory', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    likedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    blockedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export { InteractionHistory };
