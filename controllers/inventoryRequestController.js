import InventoryRequestModel from "../models/inventoryRequestModel.js";
import Ingredient from "../models/ingredientModel.js";

export const createInventoryRequest = async(req,res)=>{
    try{

        if(req.user.role !== "vendor"){
            return res.status(403).json({ msg: "Only vendors can request inventory." });
        }

        const {  quantity, ingredientId } = req.body;

        const ingredient = await Ingredient.findById(ingredientId);

        if (!ingredient) {
            return res.status(404).json({ msg: "Ingredient not found" });
        }

        if (quantity > ingredient.quantity) {
           return res.status(400).json({
           msg: `Requested quantity exceeds available stock. Available: ${ingredient.quantity}`,});
        }

       const request = new InventoryRequestModel({
          vendorId: req.user.id,
          ingredientId,
          ingredientName: ingredient.name,
          quantity,
          status: "pending",
      });

       await request.save();

       res.status(201).json({
        msg: "Inventory request created successfully.",
        request,
      });


    }catch(error){
         res.status(500).json({ msg: error.message });
    }
}


export const getVendorInventoryRequests = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Only vendors can view their requests." });
    }

    const requests = await InventoryRequestModel.find({ vendorId: req.user.id }).populate("ingredientId", "name").populate("vendorId", "name email");  
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// Get all inventory requests (Admin)
export const getAllInventoryRequests = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can view all requests." });
    }

    const requests = await InventoryRequestModel.find().populate("vendorId", "name email");
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// Update inventory request status (Admin)
export const updateInventoryRequestStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can update requests." });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status." });
    }

    const request = await InventoryRequestModel.findById(id);
    if (!request) {
      return res.status(404).json({ msg: "Inventory request not found." });
    }

     if (status === "approved") {
      const ingredient = await Ingredient.findOne(request.ingredientId);

      if (!ingredient) {
        return res.status(404).json({ msg: "Ingredient not found." });
      }

      if (ingredient.quantity < request.quantity) {
        return res.status(400).json({
          msg: `Not enough stock available. Current stock: ${ingredient.quantity}`,
        });
      }

      // Step 3: deduct stock
      ingredient.stock -= request.quantity;
      await ingredient.save();
    }

    request.status = status;
    request.approvedAt = status === "approved" ? Date.now() : null;
    await request.save();

    res.json({
      msg: `Inventory request ${status} successfully`,
      request,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete an inventory request (Admin)
export const deleteInventoryRequest = async (req, res) => {
  try {
    if (!["admin", "vendor"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only vendors/admin can delete requests." });
    }

    const { id } = req.params;
    const request = await InventoryRequestModel.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ msg: "Inventory request not found." });
    }

    res.json({ msg: "Inventory request deleted successfully." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};