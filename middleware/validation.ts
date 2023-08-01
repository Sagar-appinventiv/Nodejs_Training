import joi from '@hapi/joi';


const SingnUpschema = joi.object({
    email: joi.string().email().lowercase().required(),
    name: joi.string().min(3).max(30).required(),
    password: joi.string().min(2).required(),
    phone_number: joi.string().min(10).allow(null),
    status: joi.string().valid("Active", "Not Active"),
    DOB: joi.date().allow(null),
});

// const 

export { SingnUpschema};