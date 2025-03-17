import { Schema, model } from "mongoose";

const orderHistorySchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        productQuantity: {
          type: Number,
          min: 1,
          required: true,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { Timestamp: true }
);

const orderHistoryModel = model("OrderHistory", orderHistorySchema);

export default orderHistoryModel;
