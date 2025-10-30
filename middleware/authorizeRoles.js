export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Check if the user’s role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }

      // If everything is fine
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
};
