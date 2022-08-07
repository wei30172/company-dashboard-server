import Joi, { ObjectSchema, string } from "joi";
import { NextFunction, Request, Response } from "express";
import { IUser, IRegisterUser } from "../models/User";
import { ITask } from "../models/Task";
import { IProduct } from "../models/Product";
import { IOrder } from "../models/Order";
import Logging from "../library/Logging";

export const ValidateSchemas = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (error) {
      Logging.error(error);

      return res.status(422).json({ error });
    }
  };
};

export const Schemas = {
  auth: {
    register: Joi.object<IRegisterUser>({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
    }),
    login: Joi.object<IUser>({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  user: {
    update: Joi.object<IUser>({
      name: Joi.string().required(),
      email: Joi.string().required(),
    }),
  },
  task: {
    create: Joi.object<ITask>({
      user: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      title: Joi.string().required(),
      completed: Joi.boolean().required(),
    }),
    update: Joi.object<ITask>({
      user: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      title: Joi.string().required(),
      completed: Joi.boolean().required(),
    }),
  },
  product: {
    create: Joi.object<IProduct>({
      title: Joi.string().required(),
      image: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      availableSizes: Joi.array().required(),
    }),
    update: Joi.object<IProduct>({
      title: Joi.string().required(),
      image: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      availableSizes: Joi.array().required(),
    }),
  },
  order: {
    create: Joi.object<IOrder>({
      user: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      name: Joi.string().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      total: Joi.string().required(),
      cartItems: Joi.array().required(),
    }),
    update: Joi.object<IOrder>({
      user: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      name: Joi.string().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      total: Joi.string().required(),
      cartItems: Joi.array().required(),
    }),
  },
};
