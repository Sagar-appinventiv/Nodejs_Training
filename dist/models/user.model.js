"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const connection_1 = require("../core/connection");
const User = connection_1.sequelize.define('Users', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.default.INTEGER
    },
    email: {
        type: sequelize_1.default.STRING
    },
    name: {
        type: sequelize_1.default.STRING
    },
    password: {
        type: sequelize_1.default.STRING
    },
    phone_number: {
        type: sequelize_1.default.INTEGER
    },
    status: {
        type: sequelize_1.default.ENUM("Active", "Not Active")
    },
    DOB: {
        type: sequelize_1.default.DATE
    },
    createdAt: {
        allowNull: false,
        type: sequelize_1.default.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.default.DATE,
    }
});
exports.User = User;
//# sourceMappingURL=user.model.js.map