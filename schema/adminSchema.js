const Joi = require('joi');

module.exports.addUserSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  dob: Joi.string().required(),
  gender: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  phonenumber: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports.getUserByEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports.getUserByUUIDSchema = Joi.object({
  uuid: Joi.string().required(),
});

module.exports.getUserByRoleSchema = Joi.object({
  role: Joi.string().required(),
});

module.exports.updateUserByEmailSchemaQuery = Joi.object({
  email: Joi.string().email().required()
});

module.exports.updateUserByEmailSchemaBody = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string(),
  role: Joi.string(),
  phonenumber: Joi.string(),
  password: Joi.string(),
});

module.exports.updateUserByUUIDSchemaQuery = Joi.object({
  uuid: Joi.string().required()
});

module.exports.updateUserByUUIDSchemaBody = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string(),
  role: Joi.string(),
  email: Joi.string().email(),
  phonenumber: Joi.string(),
  password: Joi.string(),
});

module.exports.deleteUserByEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports.deleteUserByUUIDSchema = Joi.object({
  uuid: Joi.string().required(),
});