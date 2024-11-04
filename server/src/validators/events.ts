import Joi from 'joi';
import { RequestHandler } from 'express';

const validatePostEvents: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    date: Joi.date().iso().required(),
    address: Joi.string().required(),
    description: Joi.string().optional(),
    category: Joi.string()
      .valid('Concert', 'Happy Hour', 'Karaoke', 'Yard Sale', 'Other')
      .required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  return next();
};

const validateGetEvents: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    date: Joi.date().iso().optional(),
    address: Joi.string().optional(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    radius: Joi.number().min(1).max(100).required(),
  });
  const { error } = schema.validate(req.query);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  return next();
};

export { validatePostEvents, validateGetEvents };
