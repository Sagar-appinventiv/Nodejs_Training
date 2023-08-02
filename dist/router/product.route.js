"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const product_controller_1 = require("../controller/product.controller");
const express_1 = __importDefault(require("express"));
const productRouter = express_1.default.Router();
exports.productRouter = productRouter;
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
productRouter.get("/");
productRouter.post("/addProduct", validation_1.productValidator, auth_1.authenticateToken, product_controller_1.product.addProduct);
productRouter.get("/getProduct", auth_1.authenticateToken, product_controller_1.product.getProduct);
productRouter.get("/getProduct/:pId", auth_1.authenticateToken, product_controller_1.product.getProduct);
productRouter.post("/addBid/:pid", auth_1.authenticateToken, product_controller_1.product.addbid);
//# sourceMappingURL=product.route.js.map