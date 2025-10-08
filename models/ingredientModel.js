import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String, // e.g., kg, g, L, ml, pcs
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // only admin manage ingredients
  },
}, { timestamps: true });

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
