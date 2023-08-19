const Joi = require('joi');

module.exports.addSuperAdminSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  dob: Joi.string().required(),
  gender: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  phonenumber: Joi.string().required(),
  password: Joi.string().required(),
});
