//! first import JOI,
//~ then with the help of joi, create a schema or structure of blueprint -> this will be compared with req.body

import Joi from "joi";

export let registerUserSchema = Joi.object({
  name: Joi.string().min(5).max(10).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(100).required(),
  phone: Joi.string().length(10).required(),
});

export let loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(100).required(),
});

export let updateProfileSchema = Joi.object({
  name: Joi.string().min(5).max(10),
  email: Joi.string().email(),
  phone: Joi.string().length(10),
})
  .min(1)
  .message("At least one field is required to update");
