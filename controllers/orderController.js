import Order from "../models/orderModel.js"
import FoodItem from "../models/FoodItem.js";


export const createOrder = async (req, res) => {
  try {
    const { vendor, items, orderType, deliveryAddress } = req.body;

    if (!vendor) {
      return res.status(400).json({ msg: "Vendor ID is required." });
    }

    let total = 0;

    for (const item of items) {
      const food = await FoodItem.findById(item.foodItemId);

      if (!food) {
        return res.status(404).json({ msg: `Food item not found: ${item.foodItemId}` });
      }

      // ✅ Use correct price field depending on order type
      const price =
        orderType === "instant"
          ? food.instant_discount_price ?? food.instant_order_price
          : food.advance_discount_price ?? food.advance_order_price;

      if (!price) {
        return res.status(400).json({ msg: `Price not available for item ${food.name}` });
      }

      total += price * item.quantity;
    }

    const newOrder = new Order({
      customer: req.user.id,
      vendor,
      items,
      totalPrice: total,
      orderType,
      deliveryAddress,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully.",
      orderId: newOrder._id,
      totalPrice: newOrder.totalPrice,
      status: newOrder.status,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



export const getOrders = async (req, res) => {
  try {
    let filter = {};

    switch (req.user.role) {
      case "customer":
        filter.customer = req.user.id;   // ✅ match schema
        break;
      case "vendor":
        filter.vendor = req.user.id;     // ✅ match schema
        break;
      case "delivery":
        filter.deliveryGuy = req.user.id; // ✅ match schema
        break;
      case "admin":
        // admin sees all
        break;
      default:
        return res.status(403).json({ msg: "Unauthorized role" });
    }

    const orders = await Order.find(filter)
      .populate("vendor", "name email")
      .populate("customer", "name email")
      .populate("items.foodItemId", "name price")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

  //  const order = await Order.findById(id)
      const order = await Order.findById(id)
          .populate("vendor", "name email")
          .populate("customer", "name email")
          .populate("items.foodItemId", "name advance_order_price instant_order_price");
    //  .populate("deliveryGuy", "name email")
  

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Authorization check → only the related customer/vendor/delivery/admin can see it
    if (
      req.user.role !== "admin" &&
      !(
        order.customer?._id.equals(req.user.id) ||
        order.vendor?._id.equals(req.user.id) //||
       // order.deliveryGuy?._id.equals(req.user.id)
      )
    ) {
      return res.status(403).json({ msg: "Not authorized to view this order" });
    }

    res.json({
      id: order._id,
      vendor: order.vendor,
      customer: order.customer,
     // deliveryGuy: order.deliveryGuy,
      items: order.items,
      orderType: order.orderType,
      status: order.status,
      totalPrice: order.totalPrice,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "preparing",
      "ready_for_pickup",
      "picked",
      "delivered",
      "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // ✅ Authorization check
    if (
      req.user.role !== "admin" &&
      !(
        (req.user.role === "vendor" && order.vendor.toString() === req.user.id) ||
        (req.user.role === "delivery" && order.deliveryGuy?.toString() === req.user.id)
      )
    ) {
      return res.status(403).json({ msg: "Not authorized to update this order" });
    }

    // Update status
    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated successfully.",
      orderId: order._id,
      newStatus: order.status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // ✅ Authorization: only customer (owner) or admin
    if (
      req.user.role !== "admin" &&
      !(req.user.role === "customer" && order.customer.toString() === req.user.id)
    ) {
      return res.status(403).json({ msg: "Not authorized to cancel this order" });
    }

    // ✅ Cannot cancel if already picked or delivered
    if (["picked", "delivered"].includes(order.status)) {
      return res.status(400).json({ msg: "Order cannot be cancelled at this stage" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getCompletedOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can view completed orders" });
    }

    const orders = await Order.find({ status: "delivered" })
      .populate("vendor", "name")
      .populate("customer", "name")
     // .populate("deliveryGuy", "name")
      .populate("items.foodItemId", "name price")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
