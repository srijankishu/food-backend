import mongoose from "mongoose";

const inventoryRequestSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    ingredientName: {
      type: String,
      required: true,
    },

    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("InventoryRequest", inventoryRequestSchema);
