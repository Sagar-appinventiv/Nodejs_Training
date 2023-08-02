"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${process.cwd()}/uploads`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        //console.log(file.originalname)
    },
});
// Create a multer instance with the storage options
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
//# sourceMappingURL=multer.image.js.map