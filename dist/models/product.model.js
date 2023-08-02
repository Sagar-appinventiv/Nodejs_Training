"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const connection_1 = require("../core/connection");
const Product = connection_1.sequelize.define('Products', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.default.INTEGER
    },
    name: { type: sequelize_1.default.STRING },
    description: { type: sequelize_1.default.STRING },
    base_price: { type: sequelize_1.default.INTEGER },
    current_bid: { type: sequelize_1.default.INTEGER,
    },
    owner_id: { type: sequelize_1.default.INTEGER },
    bidder_id: { type: sequelize_1.default.INTEGER },
    category_id: { type: sequelize_1.default.INTEGER },
    address_id: { type: sequelize_1.default.INTEGER },
    createdAt: {
        allowNull: false,
        type: sequelize_1.default.DATE
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.default.DATE
    }
});
exports.Product = Product;
//# sourceMappingURL=product.model.js.map