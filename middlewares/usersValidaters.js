const Joi = require('joi');

// Joi validation schema for user registration
const userRegistrationSchema = Joi.object({
    user_type: Joi.string().valid('1', '2', '3', '4', '5').required(),
    user_name: Joi.string().max(50).required(),
    full_name: Joi.string().max(100).required(),
    mobile: Joi.string().max(15).required(),
    password: Joi.string().min(6).required(),
});

// Joi validation schema for user login
const userLoginSchema = Joi.object({
    user_name: Joi.string().max(50).required(),
    password: Joi.string().min(6).required(),
});

module.exports = { userRegistrationSchema, userLoginSchema };
