const Joi = require('joi');

const registerValidation = (reqData) => {
  //design schema rules
  const schema = Joi.object({
    email: Joi.string().min(10).max(50).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(8).max(20).required(),
    name: Joi.string().min(3).max(100).required(),
    role: Joi.string().required().valid("student", "instructor")
  });

  return schema.validate(reqData);
}

const loginValidation = (reqData) => {
  const schema = Joi.object({
    email: Joi.string().min(10).max(50).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(8).max(20).required()
  });

  return schema.validate(reqData);
}

const courseValidation = (reqData) => {
  const schema = Joi.object({
    title: Joi.string().min(4).max(50).required(),
    description: Joi.string().min(8).max(255).required(),
    price: Joi.number().min(100).max(1000).required()
  });

  return schema.validate(reqData);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;

