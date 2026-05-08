// controllers/session.controller.js
import {
  getActiveSession,
  getAllActiveSessions,
  getSessionHistory,
  extendSession,
  endSession
} from "../services/session.service.js";

// Obtener mi sesión actual
export const current = async (req, res) => {
  // ✅ Validar que req.user existe
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    const data = await getActiveSession(req.user.id);
    res.json(data);
  } catch (error) {
    console.error("Error getting current session:", error);
    res.status(500).json({ error: "Error getting session" });
  }
};

// Obtener todas las sesiones activas (solo admin)
export const getAllActive = async (req, res) => {
  // ✅ Validar que req.user existe
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  // Verificar que sea admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    const sessions = await getAllActiveSessions();
    res.json(sessions);
  } catch (error) {
    console.error("Error getting all sessions:", error);
    res.status(500).json({ error: "Error getting sessions" });
  }
};

// Obtener historial de sesiones (solo admin)
export const getHistory = async (req, res) => {
  // ✅ Validar que req.user existe
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = await getSessionHistory(limit);
    res.json(history);
  } catch (error) {
    console.error("Error getting session history:", error);
    res.status(500).json({ error: "Error getting history" });
  }
};

// Extender sesión (admin puede extender a cualquier usuario)
export const extend = async (req, res) => {
  // ✅ Validar que req.user existe
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const { userId, minutes = 10 } = req.body;
  const targetUserId = userId || req.user.id;

  // Si es admin y quiere extender a otro usuario, permitir
  if (userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    const result = await extendSession(targetUserId, minutes);

    if (!result) {
      return res.status(404).json({ error: "No active session found" });
    }

    res.json({
      success: true,
      message: `Session extended by ${minutes} minutes`,
      ends_at: result.ends_at
    });
  } catch (error) {
    console.error("Error extending session:", error);
    res.status(500).json({ error: "Error extending session" });
  }
};

// Terminar sesión
export const terminate = async (req, res) => {
  // ✅ Validar que req.user existe
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const { userId } = req.body;
  const targetUserId = userId || req.user.id;

  if (userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    const result = await endSession(targetUserId);

    if (!result) {
      return res.status(404).json({ error: "No active session found" });
    }

    res.json({ success: true, message: "Session terminated" });
  } catch (error) {
    console.error("Error terminating session:", error);
    res.status(500).json({ error: "Error terminating session" });
  }
};