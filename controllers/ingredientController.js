import Ingredient from "../models/ingredientModel.js";


export const addIngredient = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can add ingredients." });
    }

    const { name, stock, unit } = req.body;
    const ingredient = await Ingredient.create({
      name,
      stock,
      unit,
      adminId: req.user.id,
    });

    res.status(201).json({
      msg: "Ingredient added successfully.",
      ingredient,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error adding ingredient", error: error.message });
  }
};


export const getIngredients = async (req, res) => {
  try {
    let ingredients;
    if (req.user.role) {
      ingredients = await Ingredient.find().populate("adminId", "name email");
    } else {
      ingredients = await Ingredient.find({ vendorId: req.user.id });
    }

    res.status(200).json({ ingredients });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching ingredients", error: error.message });
  }
};


export const getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id).populate("adminId", "name email");
    if (!ingredient) {
      return res.status(404).json({ msg: "Ingredient not found." });
    }

    res.status(200).json({ ingredient });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching ingredient", error: error.message });
  }
};



export const updateIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ msg: "Ingredient not found." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to update this ingredient." });
    }

    const { name, stock, unit } = req.body;
    ingredient.name = name || ingredient.name;
    ingredient.stock = stock ?? ingredient.stock;
    ingredient.unit = unit || ingredient.unit;

    await ingredient.save();

    res.status(200).json({ msg: "Ingredient updated successfully.", ingredient });
  } catch (error) {
    res.status(500).json({ msg: "Error updating ingredient", error: error.message });
  }
};

// Delete ingredient
export const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ msg: "Ingredient not found." });
    }

    if (req.user.role !== "admin" && ingredient.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this ingredient." });
    }

    await ingredient.deleteOne();

    res.status(200).json({ msg: "Ingredient deleted successfully." });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting ingredient", error: error.message });
  }
};