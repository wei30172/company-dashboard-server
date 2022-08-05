import mongoose, { Document, Schema } from "mongoose";

export interface IOrder {
  user: string;
  name: string;
  phone: string;
  address: string;
  total: number;
  isPaid: boolean;
  isSend: boolean;
  cartItems: [
    {
      product: string;
      quantity: number;
    },
  ];
}

const ItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  quantity: { type: Number, required: true, min: [1, "Quantity can not be less then 1."] },
});

export interface IOrderModel extends IOrder, Document {}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    total: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    isSend: { type: Boolean, default: false },
    cartItems: [ItemSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IOrderModel>("Order", OrderSchema);
