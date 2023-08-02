"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.image = void 0;
const image_model_1 = require("../models/image.model");
const fs_1 = __importDefault(require("fs"));
class image {
    static addimages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.files);
                const pid = req.params.pid;
                const files = req.files;
                const bufferDataArray = [];
                for (let file in files) {
                    const fileData = fs_1.default.readFileSync(files[file].path);
                    const bufferData = Buffer.from(fileData);
                    bufferDataArray.push(bufferData);
                    console.log(bufferData);
                }
                //console.log(req.user);
                const images = yield image_model_1.Image.create({ image: bufferDataArray, product_id: pid });
                console.log(images);
                res.status(201).json({ message: "images registered successfully" });
            }
            catch (err) {
                res.status(500).json({ message: "Server Error" });
                console.log(err);
            }
        });
    }
}
exports.image = image;
//# sourceMappingURL=image.controller.js.map