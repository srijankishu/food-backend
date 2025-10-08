import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

     orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Razorpay", "Stripe", "PayPal", "COD"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
},
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);