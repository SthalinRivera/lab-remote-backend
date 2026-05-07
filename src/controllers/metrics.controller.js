import {
  getUserMetrics,
  getAllUsersMetrics
} from "../services/metrics.service.js";

// 🔹 /me
export const getMyMetrics = async (req, res) => {
  try {
    console.log('📊 getMyMetrics - Usuario ID:', req.user?.id);

    if (!req.user?.id) {
      console.error('❌ No hay user.id en el request');
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado"
      });
    }

    const data = await getUserMetrics(req.user.id);

    console.log('📊 Datos obtenidos:', data);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "No se encontraron métricas para este usuario"
      });
    }

    res.json({
      success: true,
      data: {
        total_sessions: Number(data.total_sessions) || 0,
        total_time_seconds: Number(data.total_time) || 0,
        avg_session_seconds: Number(data.avg_time) || 0,
        times_in_queue: Number(data.times_in_queue) || 0,
        total_active_time: Number(data.active_time) || 0,
        total_idle_time: Number(data.idle_time) || 0,
        total_interactions: Number(data.interactions) || 0,
        last_login: data.last_login || null
      }
    });
  } catch (error) {
    console.error('❌ Error en getMyMetrics:', error);
    console.error('Detalle:', error.message);
    console.error('Stack:', error.stack);

    res.status(500).json({
      success: false,
      error: `Error métricas usuario: ${error.message}`
    });
  }
};

// 🔹 /all
export const getAllMetrics = async (req, res) => {
  try {
    const rows = await getAllUsersMetrics();

    res.json({
      success: true,
      data: rows.map(u => ({
        id: u.id,
        email: u.email,
        total_sessions: Number(u.total_sessions),
        total_time_seconds: Number(u.total_time),
        avg_session_seconds: Number(u.avg_time),
        times_in_queue: Number(u.times_in_queue),
        total_active_time: Number(u.active_time),
        total_idle_time: Number(u.idle_time),
        total_interactions: Number(u.interactions),
        last_login: u.last_login
      }))
    });
  } catch {
    res.status(500).json({ success: false, error: "Error métricas globales" });
  }
};
export const getMetricsById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await getUserMetrics(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    res.json({
      success: true,
      data: {
        user_id: id,
        total_sessions: Number(data.total_sessions),
        total_time_seconds: Number(data.total_time),
        avg_session_seconds: Number(data.avg_time),
        times_in_queue: Number(data.times_in_queue),
        total_active_time: Number(data.active_time),
        total_idle_time: Number(data.idle_time),
        total_interactions: Number(data.interactions),
        last_login: data.last_login
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error obteniendo métricas"
    });
  }
};