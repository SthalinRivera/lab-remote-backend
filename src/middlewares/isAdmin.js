// middlewares/isAdmin.js
export default function isAdmin(req, res, next) {

  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
}