// Role-based access control middleware
// Usage: authRole('admin') or authRole('admin', 'coach')
export const authRole = (...allowedRoles) => {
  const roles = new Set(allowedRoles);
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!user.role || !roles.has(user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};


