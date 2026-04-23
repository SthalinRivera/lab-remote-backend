// services/session.service.js
import db from "../db.js";

export const getActiveSession = async (userId) => {
  const s = await db.query(`
    SELECT 
      id,
      user_id,
      started_at,
      ends_at,
      status,
      GREATEST(EXTRACT(EPOCH FROM (ends_at - now())), 0) AS remaining
    FROM sessions
    WHERE user_id = $1 AND status = 'active'
  `, [userId]);

  return s.rows[0] || null;
};