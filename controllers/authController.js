import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register=async(req,res)=>{
  try{

    const { role, name, email, password, phone, address, photo, idProof } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      role,
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      photo,
      idProof,
    });

    await newUser.save();
    res.status(201).json({ msg: " User registered successfully" });

  }catch (error) {
    res.status(500).json({ msg: error.message });
  }

};

export const login=async(req,res)=>{

   try{
     
    const {email,password} = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(   
        {id:user._id, role:user.role},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }    
    );

    res.json({
      msg: " Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    
   }catch (error) {
    res.status(500).json({ msg: error.message });
  }
}





