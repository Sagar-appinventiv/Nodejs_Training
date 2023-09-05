import Sequelize from 'sequelize';
import { sequelize } from '../database/dbConnection';

const User = sequelize.define('user', {
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
    // stripeCustomerId: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    // },
    verifiedUser: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    bio: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    mobileNo: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    profilePicture: {
        type: Sequelize.STRING(100),
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
    // notifications: {
    //     type: Sequelize.ARRAY(Sequelize.JSONB),
    //     defaultValue: [],
    // },
    galleryPhotos: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        // validate: {
        //     validateGalleryPhotos(value:any) {
        //         if (value.length > 4) {
        //             throw new Error('Gallery can have a maximum of 4 photos.');
        //         }
        //     }
        // },
    },
    blockedUsers: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: [],
    },
    matches: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: true,
        defaultValue: [],
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

// User.sync({ alter: true });

export { User };