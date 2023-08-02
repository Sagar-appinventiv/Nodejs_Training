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
exports.Auth = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const key = process.env.SECRET_KEY;
class Auth {
    static verify_token(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            console.log(token);
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, key);
                return decoded;
            }
            else {
                return false;
            }
        });
    }
    static find_user(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUser = yield user_model_1.User.findOne({ where: { email } });
            if (isUser) {
                return isUser;
            }
            else {
                return false;
            }
        });
    }
    static generate_hash_pass(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
}
exports.Auth = Auth;
//# sourceMappingURL=decode.js.map