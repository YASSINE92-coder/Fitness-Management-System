import { hasRoleOrHigher, hasPermission } from '../utils/roles.js';

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
      return res.status(403).json({ 
        message: "Forbidden: insufficient role",
        required: Array.from(roles),
        current: user.role
      });
    }
    next();
  };
};

// Permission-based access control middleware
// Usage: authPermission('view_all_profiles')
export const authPermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!hasPermission(user.role, permission)) {
      return res.status(403).json({ 
        message: "Forbidden: insufficient permission",
        required: permission,
        current: user.role
      });
    }
    next();
  };
};

// Role hierarchy middleware - allows role or higher
// Usage: authRoleOrHigher('coach') - allows coach, gym, admin
export const authRoleOrHigher = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!hasRoleOrHigher(user.role, requiredRole)) {
      return res.status(403).json({ 
        message: "Forbidden: insufficient role level",
        required: requiredRole,
        current: user.role
      });
    }
    next();
  };
};

// Multiple permissions middleware - requires ALL permissions
// Usage: authPermissions(['view_profiles', 'edit_profiles'])
export const authPermissions = (permissions) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const missingPermissions = permissions.filter(permission => 
      !hasPermission(user.role, permission)
    );
    
    if (missingPermissions.length > 0) {
      return res.status(403).json({ 
        message: "Forbidden: missing required permissions",
        missing: missingPermissions,
        current: user.role
      });
    }
    next();
  };
};

// Any permission middleware - requires ANY of the permissions
// Usage: authAnyPermission(['view_profiles', 'edit_profiles'])
export const authAnyPermission = (permissions) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const hasAnyPermission = permissions.some(permission => 
      hasPermission(user.role, permission)
    );
    
    if (!hasAnyPermission) {
      return res.status(403).json({ 
        message: "Forbidden: no required permissions",
        required: permissions,
        current: user.role
      });
    }
    next();
  };
};


