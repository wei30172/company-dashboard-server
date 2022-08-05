import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";

const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const { title, image, description, price, availableSizes } = req.body;

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    title,
    image,
    description,
    price,
    availableSizes,
  });

  return product
    .save()
    .then((product) => res.status(201).json({ product }))
    .catch((error) => res.status(500).json({ error }));
};

const getProduct = (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId;

  return Product.findById(productId)
    .then((product) => (product ? res.status(200).json({ product }) : res.status(404).json({ message: "not found" })))
    .catch((error) => res.status(500).json({ error }));
};

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  return Product.find()
    .then((products) => res.status(200).json({ products }))
    .catch((error) => res.status(500).json({ error }));
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId;

  return Product.findById(productId)
    .then((product) => {
      if (product) {
        product.set(req.body);

        return product
          .save()
          .then((product) => res.status(201).json({ product }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId;

  return Product.findByIdAndDelete(productId)
    .then((product) => (product ? res.status(201).json({ product, message: "product deleted" }) : res.status(404).json({ message: "not found" })))
    .catch((error) => res.status(500).json({ error }));
};

export default { createProduct, getProduct, getProducts, updateProduct, deleteProduct };
