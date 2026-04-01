const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{8,30}$')).required()
        .messages({
            'string.pattern.base': 'Password must be 8-30 characters and include alphanumeric or special characters (!@#$%^&*)'
        }),
    role_name: Joi.string().valid('Admin', 'Analyst', 'Viewer').default('Viewer')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const verifyOTPSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
});

module.exports = { registerSchema, loginSchema, verifyOTPSchema };
