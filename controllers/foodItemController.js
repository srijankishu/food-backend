import FoodItem from "../models/FoodItem.js";

export const CreateFoodItems = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Only vendors can create food items" });
    }

    const foodItem = new FoodItem({
      ...req.body,
      vendorId: req.user.id,
    });

    await foodItem.save();

    res.status(201).json({
      message: "Food item created successfully.",
      foodItemId: foodItem._id,
      foodItem,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get all food items of logged-in vendor
export const getMyFoodItems = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Only vendors can view their items" });
    }

    const items = await FoodItem.find({ vendorId: req.user.id });
    res.json({ foodItems: items });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Update food item (Vendor only)
export const updateFoodItem = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Only vendors can update food items" });
    }

    const item = await FoodItem.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id },
      req.body,
      { new: true }
    );

    if (!item) return res.status(404).json({ msg: "Food item not found" });

    res.json({
      message: "Food item updated successfully.",
      foodItemId: item._id,
      updatedItem: item,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Delete food item (Vendor only)
export const deleteFoodItem = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Only vendors can delete food items" });
    }

    const item = await FoodItem.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.user.id,
    });

    if (!item) return res.status(404).json({ msg: "Food item not found" });

    res.json({ message: "Food item deleted successfully." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Public - Get all food items
export const getAllFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.find().populate("vendorId", "name email");
    res.json({ foodItems: items });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};