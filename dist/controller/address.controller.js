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
Object.defineProperty(exports, "__esModule", { value: true });
exports.address = void 0;
const address_model_1 = require("../models/address.model");
class address {
    static addAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const detail = req.body;
            try {
                yield address_model_1.Address.create(detail);
                res.status(201).json({ message: "Address registered successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
                console.log(error);
            }
        });
    }
}
exports.address = address;
//# sourceMappingURL=address.controller.js.map