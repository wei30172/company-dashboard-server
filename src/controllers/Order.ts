import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";

const createOrder = (req: Request, res: Response, next: NextFunction) => {
  const { name, phone, address, total, cartItems } = req.body;
  const isPaid = false;
  const isSend = false;

  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    name,
    phone,
    address,
    total,
    cartItems,
    isPaid,
    isSend,
  });

  return order
    .save()
    .then((order) => res.status(201).json({ order }))
    .catch((error) => res.status(500).json({ error }));
};

const getOrder = (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;

  return Order.findById(orderId)
    .then((order) => (order ? res.status(200).json({ order }) : res.status(404).json({ message: "not found" })))
    .catch((error) => res.status(500).json({ error }));
};

const getOrders = (req: Request, res: Response, next: NextFunction) => {
  return Order.find()
    .then((orders) => res.status(200).json({ orders }))
    .catch((error) => res.status(500).json({ error }));
};

const updateOrder = (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;

  return Order.findById(orderId)
    .then((order) => {
      if (order) {
        order.set(req.body);

        return order
          .save()
          .then((order) => res.status(201).json({ order }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteOrder = (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;

  return Order.findByIdAndDelete(orderId)
    .then((order) => (order ? res.status(201).json({ order, message: "order deleted" }) : res.status(404).json({ message: "not found" })))
    .catch((error) => res.status(500).json({ error }));
};

export default { createOrder, getOrder, getOrders, updateOrder, deleteOrder };
