"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const connection_1 = require("../core/connection");
const Session = connection_1.sequelize.define('Sessions', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.default.INTEGER
    },
    user_id: { type: sequelize_1.default.INTEGER },
    device_id: { type: sequelize_1.default.STRING },
    status: { type: sequelize_1.default.BOOLEAN },
    createdAt: {
        allowNull: false,
        type: sequelize_1.default.DATE
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.default.DATE
    }
});
exports.Session = Session;
//# sourceMappingURL=session.model.js.map