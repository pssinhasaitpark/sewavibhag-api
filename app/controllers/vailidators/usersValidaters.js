// userValidator.js
const Joi = require('joi');

// Joi validation schema for user registration
const userRegistrationSchema = Joi.object({
    user_type: Joi.string().valid('kendra', 'kshetra', 'prant', 'vibhag', 'jila').required(),
    user_name: Joi.string().max(50).required(),
    full_name: Joi.string().max(50).required(),
    email: Joi.string().email(),
    mobile: Joi.string().max(13).required(),
    password: Joi.string().min(8).required(),
    user_type_id: Joi.string().max(50),  
    level: Joi.number().valid(1, 2, 3).required()
});

// Joi validation schema for user login
const userLoginSchema = Joi.object({
    user_name: Joi.string().max(50).required(),
    password: Joi.string().min(8).required(),
});

module.exports = { userRegistrationSchema, userLoginSchema };
