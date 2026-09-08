const Joi = require("joi");

module.exports.certificate = Joi.object({
  event: Joi.string().required(),
  name: Joi.string().required(),
  roll: Joi.number().required(),
  date: Joi.string().required(),
});
