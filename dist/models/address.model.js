"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const connection_1 = require("../core/connection");
const Address = connection_1.sequelize.define('Addresses', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.default.INTEGER
    },
    street1: { type: sequelize_1.default.STRING },
    street2: { type: sequelize_1.default.STRING },
    landmark: { type: sequelize_1.default.STRING },
    city: { type: sequelize_1.default.STRING },
    state: { type: sequelize_1.default.STRING },
    zip_code: { type: sequelize_1.default.INTEGER },
    address_type: { type: sequelize_1.default.ENUM("Work", "Home", "other") },
    user_id: { type: sequelize_1.default.INTEGER },
    createdAt: {
        allowNull: false,
        type: sequelize_1.default.DATE
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.default.DATE
    }
});
exports.Address = Address;
console.log("user model");
//# sourceMappingURL=address.model.js.map