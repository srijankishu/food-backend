import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deliveryGuyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        foodItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    orderType: {
      type: String,
      enum: ["advance", "instant"],
      default: "advance", // 👈 default is "advance"
    },

    deliveryAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Optional: calculate totalPrice before saving
orderSchema.pre("save", async function (next) {
  if (!this.isModified("items")) return next();

  try {
    const FoodItem = mongoose.model("FoodItem");

    let total = 0;
    for (const item of this.items) {
      const food = await FoodItem.findById(item.foodItemId);
      if (food) total += food.price * item.quantity;
    }

    this.totalPrice = total;
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Order", orderSchema);
