import mongoose, { Document, Schema } from "mongoose";

export interface IProduct {
  title: string;
  image: string;
  description: string;
  price: number;
  availableSizes: string[];
}

export interface IProductModel extends IProduct, Document {}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    availableSizes: { type: [String], required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IProductModel>("Product", ProductSchema);
