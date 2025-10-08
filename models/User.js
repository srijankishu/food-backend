import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    role:{
      type: String, 
      enum: ["customer", "vendor", "delivery", "admin"], 
      required: true
    },

    name:{
        type: String, 
        required: true
    },

    email:{
        type: String, 
        unique: true, 
        required: true
    },

    password:{
       type: String,
       required: true 
    },

    phone: String,

    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
    },

    photo: String,
    idProof: String,

},{ timestamps: true })

export default mongoose.model("User",userSchema);