"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRouter = void 0;
const express_1 = __importDefault(require("express"));
const image_controller_1 = require("../controller/image.controller");
const auth_1 = require("../middleware/auth");
const multer_image_1 = require("../middleware/multer.image");
const imageRouter = express_1.default.Router();
exports.imageRouter = imageRouter;
imageRouter.get("/");
imageRouter.post("/addImage/:pid", auth_1.authenticateToken, multer_image_1.upload.array('images', 5), image_controller_1.image.addimages);
//# sourceMappingURL=image.route.js.map