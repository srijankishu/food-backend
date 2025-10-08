import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({

    customer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendor:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items:[
        {
            foodItemId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"FoodItem",
                required:true
            },
            quantity: { type: Number, required: true, min: 1 },
        }
    ],

    totalPrice: { type: Number, required: true },

    orderType: {
      type: String,
      enum: ["normal", "advance"],
      default: "normal",
    },

     deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },

     status: {
      type: String,
      enum: [  "pending", "accepted", "preparing", "out-for-delivery", "delivered", "cancelled"],
      default: "pending",
    },

    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
},
  { timestamps: true }
)

export default mongoose.model("Order", orderSchema);