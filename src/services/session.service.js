// services/session.service.js
import db from "../db.js";

// Obtener sesión activa de un usuario específico
export const getActiveSession = async (userId) => {
  const s = await db.query(`
    SELECT 
      id,
      user_id,
      started_at,
      ends_at,
      status,
      GREATEST(EXTRACT(EPOCH FROM (ends_at - NOW())), 0) AS remaining
    FROM sessions
    WHERE user_id = $1 AND status = 'active'
  `, [userId]);

  return s.rows[0] || null;
};

// Obtener TODAS las sesiones activas (para admin)
export const getAllActiveSessions = async () => {
  const sessions = await db.query(`
    SELECT 
      s.id,
      s.user_id,
      s.started_at,
      s.ends_at,
      s.status,
      s.duration_seconds,
      GREATEST(EXTRACT(EPOCH FROM (s.ends_at - NOW())), 0) AS remaining,
      u.name as user_name,
      u.email as user_email,
      u.avatar_url
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.status = 'active'
    ORDER BY s.ends_at ASC
  `);

  return sessions.rows;
};

// ✅ CORREGIDO: Obtener historial de sesiones
export const getSessionHistory = async (limit = 50) => {
  const sessions = await db.query(`
    SELECT 
      s.id,
      s.user_id,
      u.name as user_name,
      u.email as user_email,
      s.started_at,
      s.ends_at,
      s.status,
      EXTRACT(EPOCH FROM (s.ends_at - s.started_at)) as duration_seconds
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.status IN ('finished', 'expired')
    ORDER BY s.ends_at DESC
    LIMIT $1
  `, [limit]);

  return sessions.rows;
};

// Extender sesión
export const extendSession = async (userId, minutes) => {
  const result = await db.query(`
    UPDATE sessions
    SET ends_at = ends_at + ($1 || ' minutes')::INTERVAL
    WHERE user_id = $2 AND status = 'active'
    RETURNING id, ends_at
  `, [minutes, userId]);

  if (result.rows.length > 0) {
    await db.query(`
      INSERT INTO session_events (session_id, event_type, payload)
      VALUES ($1, 'extended', $2)
    `, [result.rows[0].id, JSON.stringify({ minutes })]);
  }

  return result.rows[0] || null;
};

// Terminar sesión anticipadamente
export const endSession = async (userId) => {
  const result = await db.query(`
    UPDATE sessions
    SET status = 'finished'
    WHERE user_id = $1 AND status = 'active'
    RETURNING id
  `, [userId]);

  if (result.rows.length > 0) {
    await db.query(`
      INSERT INTO session_events (session_id, event_type, payload)
      VALUES ($1, 'ended_early', $2)
    `, [result.rows[0].id, JSON.stringify({})]);

    const countResult = await db.query(`
      SELECT COUNT(*) FROM sessions WHERE status = 'active'
    `);

    if (parseInt(countResult.rows[0].count) === 0) {
      await db.query(`
        UPDATE lab SET is_busy = false, current_session_id = NULL
      `);
    }
  }

  return result.rows[0] || null;
};