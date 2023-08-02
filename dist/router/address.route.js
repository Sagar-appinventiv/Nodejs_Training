"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRouter = void 0;
const express_1 = __importDefault(require("express"));
const address_controller_1 = require("../controller/address.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const addressRouter = express_1.default.Router();
exports.addressRouter = addressRouter;
addressRouter.get("/");
addressRouter.post("/addAddress", validation_1.addressValidation, auth_1.authenticateToken, address_controller_1.address.addAddress);
//# sourceMappingURL=address.route.js.map