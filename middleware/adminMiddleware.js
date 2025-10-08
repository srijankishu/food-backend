export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ msg: "Server error in adminMiddleware." });
  }
};
