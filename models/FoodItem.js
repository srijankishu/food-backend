import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String },
});

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: String, default: "1" },
    serving: { type: String, default: "1" },
    serving_unit: { type: String, default: "plate" },
    calories: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
    protein: { type: Number },

    // pricing details
    instant_order_price: { type: Number },
    advance_order_price: { type: Number },
    instant_discount_price: { type: Number },
    advance_discount_price: { type: Number },

    // food properties
    order_type: {
       type: [String],
       enum: ["instant", "advance"],
       default: ["advance"], // 👈 default to advance
    },

    food_type: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
    cooking_time: { type: String },

    // ingredients
    ingredients: [ingredientSchema],

    // category relation
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // vendor (food maker)
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // availability
    is_available: { type: Boolean, default: true },

    // image support
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("FoodItem", foodItemSchema);
