import { Schema, model } from "mongoose";

const cartSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        qauntity: {
          type: Number,
          required: true,
          min: 1,
        },
        amount: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: String,
      default: Date.now,
    },
  },
  { Timestamp: true }
);

const cartModel = model("Cart", cartSchema);

export default cartModel;
