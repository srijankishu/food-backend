import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
});

const foodItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["advance", "instant"],
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    ingredients: [ingredientSchema],
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
     default: null,
    }

  },
  { timestamps: true }
);

export default mongoose.model("FoodItem", foodItemSchema);
