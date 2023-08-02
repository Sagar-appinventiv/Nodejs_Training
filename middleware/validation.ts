import Joi from 'joi';

export const userValidate = (req: any, res: any, next: () => void) => {
    const SingnUpschema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        name: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(2).required(),
        phone_number: Joi.string().min(10).allow(null),
        status: Joi.string().valid("Active", "Not Active"),
        DOB: Joi.date().allow(null),
    });
    const result = SingnUpschema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error).json({ message: "Invalid user input" });
    }
    else {
        next();
    }
}

export const loginValidation = (req: any, res: any, next: () => void) => {
    const verify_login_details = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(30).required()
    })
    let result = verify_login_details.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error);
    }
    else {
        next();
    }
}

export const productValidator = (req: any, res: any, next: () => void) => {

    const ProductSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        base_price: Joi.number().required(),
        current_bid: Joi.number().required(),
        owner_id: Joi.number().required(),
        bidder_id: Joi.number().required(),
        category_id: Joi.number().required(),
        address_id: Joi.number().required()

    });
    const result = ProductSchema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error);
    }
    else {
        next();
    }
}

export const addressValidation = (req: any, res: any, next: () => void) => {

    const AddressSchema = Joi.object({
        street1: Joi.string().required(),
        street2: Joi.string().required(),
        landmark: Joi.string().allow('').optional(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip_code: Joi.number().required(),
        address_type: Joi.valid('Home', 'Work', 'other').required(),
        user_id: Joi.number().required(),
    });
    const result = AddressSchema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error);
    }
    else {
        next();
    }
}