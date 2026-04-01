const Joi = require('joi');

const recordSchema = Joi.object({
    amount: Joi.number().precision(2).positive().required(),
    type: Joi.string().valid('Income', 'Expense').required(),
    category: Joi.string().min(2).max(50).required(),
    date: Joi.date().iso().required(),
    description: Joi.string().max(500).allow('', null)
});

const updateRecordSchema = Joi.object({
    amount: Joi.number().precision(2).positive(),
    type: Joi.string().valid('Income', 'Expense'),
    category: Joi.string().min(2).max(50),
    date: Joi.date().iso(),
    description: Joi.string().max(500).allow('', null)
}).min(1);

module.exports = { recordSchema, updateRecordSchema };
