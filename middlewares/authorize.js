// Authorize if the requester is the resource owner (req.params.id)
// or has one of the allowed roles.
export const authorizeSelfOrRoles = (...allowedRoles) => {
  const roles = new Set(allowedRoles);
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const isOwner = req.params && req.params.id && String(req.user._id) === String(req.params.id);
    const hasRole = req.user.role && roles.has(req.user.role);
    if (isOwner || hasRole) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: not owner or insufficient role" });
  };
};



