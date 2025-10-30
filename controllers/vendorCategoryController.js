import FoodItem  from "../models/FoodItem.js";
import { Category } from "../models/categoryModel.js";

// 🔹 Assign a food item to a category
export const assignFoodToCategory = async (req, res) => {
  try {
    const { id } = req.params; // food item id
    const { categoryId } = req.body;

    const food = await FoodItem.findById(id);
    if (!food) return res.status(404).json({ message: "Food item not found" });

    if (food.vendorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    food.category = categoryId;
    await food.save();

    res.status(200).json({
      message: "Food item assigned to category successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get all food items for a category (Vendor)
export const getFoodByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const foods = await FoodItem.find({
      vendorId: req.user.id,
      category: categoryId,
    }).populate("category", "name");
;

    res.status(200).json({ foodItems: foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllCategoriesForVendor = async (req, res) => {
  try {
    const categories = await Category.find({}, "name description imageUrl");

    if (!categories.length) {
      return res.status(404).json({ message: "No categories available." });
    }

    res.status(200).json({
      message: "Categories fetched successfully.",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories for vendor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
