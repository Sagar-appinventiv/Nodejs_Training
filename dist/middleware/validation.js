"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressValidation = exports.productValidator = exports.loginValidation = exports.userValidate = void 0;
const joi_1 = __importDefault(require("joi"));
const userValidate = (req, res, next) => {
    const SingnUpschema = joi_1.default.object({
        email: joi_1.default.string().email().lowercase().required(),
        name: joi_1.default.string().min(3).max(30).required(),
        password: joi_1.default.string().min(2).required(),
        phone_number: joi_1.default.string().min(10).allow(null),
        status: joi_1.default.string().valid("Active", "Not Active"),
        DOB: joi_1.default.date().allow(null),
    });
    const result = SingnUpschema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error).json({ message: "Invalid user input" });
    }
    else {
        next();
    }
};
exports.userValidate = userValidate;
const loginValidation = (req, res, next) => {
    const verify_login_details = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(5).max(30).required()
    });
    let result = verify_login_details.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error);
    }
    else {
        next();
    }
};
exports.loginValidation = loginValidation;
const productValidator = (req, res, next) => {
    const ProductSchema = joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        base_price: joi_1.default.number().required(),
        current_bid: joi_1.default.number().required(),
        owner_id: joi_1.default.number().required(),
        bidder_id: joi_1.default.number().required(),
        category_id: joi_1.default.number().required(),
        address_id: joi_1.default.number().required()
    });
    const result = ProductSchema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error);
    }
    else {
        next();
    }
};
exports.productValidator = productValidator;
const addressValidation = (req, res, next) => {
    const AddressSchema = joi_1.default.object({
        street1: joi_1.default.string().required(),
        street2: joi_1.default.string().required(),
        landmark: joi_1.default.string().allow('').optional(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        zip_code: joi_1.default.number().required(),
        address_type: joi_1.default.valid('Home', 'Work', 'other').required(),
        user_id: joi_1.default.number().required(),
    });
    const result = AddressSchema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error);
    }
    else {
        next();
    }
};
exports.addressValidation = addressValidation;
//# sourceMappingURL=validation.js.map