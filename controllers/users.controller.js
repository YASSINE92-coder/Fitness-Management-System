import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, gender } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role, gender });
    return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, gender: user.gender });
  } catch (err) {
    console.error("createUser error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("getUserById error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }
    // Prevent changing email to an existing one
    if (updates.email) {
      const other = await User.findOne({ email: updates.email, _id: { $ne: req.params.id } });
      if (other) return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("updateUserById error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error("deleteUserById error", err);
    return res.status(500).json({ message: "Server error" });
  }
};



