const Joi = require('joi');

const adminSchema = Joi.object({
  firstname : Joi.string().required(),
  lastname : Joi.string().required(),
  dob : Joi.string().required(),
  gender : Joi.string().required(),
  role : Joi.string().required(),
  email : Joi.string().required(),
  phonenumber : Joi.string().required(),
  password : Joi.string().required(),
});

module.exports = adminSchema;