import Sequelize from 'sequelize';
import { sequelize } from '../database/dbConnection';

const Like = sequelize.define('like', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    likerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    likedUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
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

Like.findMatchesForUser = async function (userId: any) {
    const matches = await Like.findAll({
        where: {
            likerId: userId,
        },
    });

    return matches;
};
Like.isMatch = async function (likerId: any, likedUserId: any) {
    if (!likerId || !likedUserId) {
        return false; // Return false if either value is undefined
    }
    const matchCount = await Like.count({
        where: {
            likerId: likedUserId,
            likedUserId: likerId,
        },
    });

    return matchCount > 0;
};
// Like.sync({ alter: true });

export { Like };
