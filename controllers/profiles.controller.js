// GET /api/user/profile - return authenticated user's profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Not authorized" });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      avatar: user.avatar,
      profile: user.profile,
    });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/profile - update authenticated user's profile
export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Not authorized" });

    const updates = { ...req.body };
    // Prevent changing role or refreshTokens via this endpoint
    delete updates.role;
    delete updates.refreshTokens;
    delete updates.googleId;

    // If password is provided, let the users.controller handle hashing; here we reject
    if (updates.password) return res.status(400).json({ message: "Password cannot be updated here" });

    Object.assign(user, updates);
    await user.save();

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      avatar: user.avatar,
      profile: user.profile,
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
// PUT /api/user/profile - DEACTIVATE authenticated user's profile
export const deleteProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Not authorized" });

    // Soft delete: mark user as inactive
    user.isActive = false;

    await user.save();

    return res.status(200).json({
      message: "Profile deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error("deleteProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export default { getProfile, updateProfile, deleteProfile };
