import { Model, DataTypes } from 'sequelize';
import Sequelize from 'sequelize';
import { sequelize } from '../database/dbConnection';

const ArchivedUser = sequelize.define('archivedUsers', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mobile_no: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    profilePicture: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dateOfBirth: {
        type: Sequelize.DATE(),
        allowNull: true
    },
    interestedIn: {
        type: Sequelize.STRING,
        allowNull: true
    },
    areaLocality: {
        type: Sequelize.STRING,
        allowNull: true
    },
    hobbies: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
    }
});

(async function () {
    await ArchivedUser.sync({ alter: true })
})();

export { ArchivedUser };