"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoute_1 = require("./userRoute");
const categoryRoute_1 = require("./categoryRoute");
const product_route_1 = require("./product.route");
const address_route_1 = require("./address.route");
const image_route_1 = require("./image.route");
class AppRouter {
    constructor() {
        this.router = express_1.default.Router();
    }
    loadAppRoutes() {
        this.router.use('/', userRoute_1.userRouter);
        this.router.use('/', categoryRoute_1.cateRouter);
        this.router.use('/', product_route_1.productRouter);
        this.router.use('/', address_route_1.addressRouter);
        this.router.use('/', image_route_1.imageRouter);
        return this.router;
    }
}
exports.appRoutes = new AppRouter();
//# sourceMappingURL=index.route.js.map