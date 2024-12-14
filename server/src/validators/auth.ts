import Joi from 'joi';
import { RequestHandler } from 'express';

const validateSignUp: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  return next();
};

const validateSignIn: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  return next();
};

const validateSignOut: RequestHandler = (req, res, next) => {
  const schema = Joi.object({});
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  return next();
};

export { validateSignUp, validateSignIn, validateSignOut };
