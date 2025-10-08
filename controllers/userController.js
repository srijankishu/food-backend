import User from "../models/User.js";

export const getProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);

    }catch(err){
        res.status(500).json({ msg: err.message });
    }
}

export const updateProfile = async(req,res)=>{
    try {
    const { name, phone, address, photo } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, photo },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // logged-in user can delete their own account
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "✅ User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};