// middlewares/isAdmin.js
export default function isAdmin(req, res, next) {
  // ✅ Validar que req.user existe
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  // ✅ CORREGIDO: Solo permitir a admins
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Acceso denegado. Se requieren permisos de administrador."
    });
  }

  console.log("✅ Admin autorizado:", req.user.email);
  next();
}