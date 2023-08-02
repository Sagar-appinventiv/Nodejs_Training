"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const connection_1 = require("../core/connection");
const Category = connection_1.sequelize.define('Categories', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.default.INTEGER
    },
    name: { type: sequelize_1.default.STRING },
    parent_id: { type: sequelize_1.default.INTEGER },
    createdAt: {
        allowNull: false,
        type: sequelize_1.default.DATE
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.default.DATE
    }
});
exports.Category = Category;
//# sourceMappingURL=category.model.js.map