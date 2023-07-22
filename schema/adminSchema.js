const Joi = require('joi');

const dataSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = dataSchema;