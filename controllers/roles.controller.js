import User from "../models/User.js";
import { ROLES, PERMISSIONS, ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS, hasPermission, hasRoleOrHigher } from "../utils/roles.js";

// ========================= GET ALL ROLES =========================
export const getAllRoles = async (req, res) => {
  try {
    const roles = Object.values(ROLES).map(role => ({
      value: role,
      displayName: ROLE_DISPLAY_NAMES[role],
      description: ROLE_DESCRIPTIONS[role],
      permissions: PERMISSIONS[role],
      hierarchy: Object.keys(ROLES).find(key => ROLES[key] === role)
    }));

    res.json({
      success: true,
      roles
    });
  } catch (err) {
    console.error("Get roles error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= GET ROLE PERMISSIONS =========================
export const getRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role",
        validRoles: Object.values(ROLES)
      });
    }

    res.json({
      success: true,
      role: {
        value: role,
        displayName: ROLE_DISPLAY_NAMES[role],
        description: ROLE_DESCRIPTIONS[role],
        permissions: PERMISSIONS[role]
      }
    });
  } catch (err) {
    console.error("Get role permissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= CHECK USER PERMISSIONS =========================
export const checkUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ 
        message: "Permissions array is required" 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const permissionResults = permissions.map(permission => ({
      permission,
      hasPermission: hasPermission(user.role, permission)
    }));

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      },
      permissions: permissionResults
    });
  } catch (err) {
    console.error("Check permissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= UPDATE USER ROLE =========================
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    if (!Object.values(ROLES).includes(newRole)) {
      return res.status(400).json({ 
        message: "Invalid role",
        validRoles: Object.values(ROLES)
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    res.json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        oldRole,
        newRole: user.role
      }
    });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= GET USERS BY ROLE =========================
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 10, isActive, isApproved } = req.query;

    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role",
        validRoles: Object.values(ROLES)
      });
    }

    const filter = { role };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isApproved !== undefined) filter.is_approved = isApproved === 'true';

    const users = await User.find(filter)
      .select('-password -refreshTokens')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (err) {
    console.error("Get users by role error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= GET ROLE STATISTICS =========================
export const getRoleStatistics = async (req, res) => {
  try {
    const stats = await Promise.all(
      Object.values(ROLES).map(async (role) => {
        const total = await User.countDocuments({ role });
        const active = await User.countDocuments({ role, isActive: true });
        const approved = await User.countDocuments({ role, is_approved: true });
        
        return {
          role,
          displayName: ROLE_DISPLAY_NAMES[role],
          total,
          active,
          approved,
          pending: total - approved
        };
      })
    );

    const totalUsers = stats.reduce((sum, stat) => sum + stat.total, 0);

    res.json({
      success: true,
      statistics: stats,
      summary: {
        totalUsers,
        totalActive: stats.reduce((sum, stat) => sum + stat.active, 0),
        totalApproved: stats.reduce((sum, stat) => sum + stat.approved, 0)
      }
    });
  } catch (err) {
    console.error("Get role statistics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= APPROVE USER =========================
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved = true } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only coaches and gyms need approval
    if (!['coach', 'gym'].includes(user.role)) {
      return res.status(400).json({ 
        message: "Only coaches and gyms require approval" 
      });
    }

    user.is_approved = approved;
    await user.save();

    res.json({
      success: true,
      message: `User ${approved ? 'approved' : 'rejected'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        is_approved: user.is_approved
      }
    });
  } catch (err) {
    console.error("Approve user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= TOGGLE USER STATUS =========================
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    console.error("Toggle user status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

