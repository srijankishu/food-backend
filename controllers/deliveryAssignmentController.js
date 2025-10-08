import DeliveryAssignmentModel from "../models/deliveryAssignmentModel.js";
import Order from "../models/orderModel.js";
import User from "../models/User.js"

export const AssignOrder = async (req, res) => {
  try {
    const { orderId, deliveryGuyId, assignedBy } = req.body;

    const allowedRoles = ["admin", "vendor"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied. Only admin/vendor can assign orders" });
    }

    // Check order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    //✅ Check if deliveryGuyId belongs to a user with role "deliveryGuy"

    const deliveryGuy = await User.findById(deliveryGuyId);
    if (!deliveryGuy || deliveryGuy.role !== "delivery") {
        return res.status(400).json({ msg: "Invalid delivery guy ID" });
    }

    // Create assignment
    const assignment = await DeliveryAssignmentModel.create({
      orderId,
      deliveryGuyId,
      assignedBy,
    });

    res.status(201).json({
      message: "Order assigned to delivery guy successfully.",
      assignmentId: assignment._id,
      orderId,
      deliveryGuyId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};



export const getAssignmentsForDeliveryGuy = async (req, res) => {
  try {

    if ( req.user.role !== "delivery" ) {
      return res.status(403).json({ msg: "Access denied. Only delivery guy can see assignments" });
    }
    const deliveryGuyId = req.user.id; // from authMiddleware

    const assignments = await DeliveryAssignmentModel.find({ deliveryGuyId })
      .populate("orderId");

    res.json({ assignments });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



export const getAllAssignments = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Only admin can see assignments"});
    }
    
    const assignments = await DeliveryAssignmentModel.find()
      .populate("orderId")
      .populate("deliveryGuyId", "name email");

    res.json({ assignments });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateAssignmentStatus = async (req, res) => {
  try {

   const allowedRoles = ["admin", "delivery"];

if (!allowedRoles.includes(req.user.role)) {
  return res.status(403).json({ msg: "Access denied. Only admin/vendor can assign orders" });
}
    const { status } = req.body;

    const assignment = await DeliveryAssignmentModel.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    assignment.status = status;
    if (status === "delivered") {
      assignment.deliveredAt = Date.now();
    }

    await assignment.save();

    res.json({
      message: "Delivery assignment status updated successfully.",
      assignmentId: assignment._id,
      newStatus: status,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const cancelAssignment = async (req, res) => {

    try {
    // ✅ only Admin can cancel assignments
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Only admin can cancel delivery assignments." });
    }

    const { id } = req.params;

    const assignment = await DeliveryAssignmentModel.findById(id);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    // ✅ optional check: ensure assignment not already picked/delivered
    if (assignment.status === "picked" || assignment.status === "delivered") {
      return res.status(400).json({ msg: "Cannot cancel assignment that is already picked or delivered." });
    }

    await assignment.deleteOne();

    res.json({
      message: "Delivery assignment cancelled successfully.",
      assignmentId: id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};




