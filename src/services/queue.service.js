// services/queue.service.js
import db from "../db.js";

export const joinQueue = async (userId) => {
  // evitar duplicados
  const exists = await db.query(
    "SELECT * FROM queue WHERE user_id=$1 AND status='waiting'",
    [userId]
  );

  if (exists.rows.length > 0) {
    return exists.rows[0];
  }

  const result = await db.query(`   
    INSERT INTO queue (id, user_id, status)
    VALUES (uuid_generate_v4(), $1, 'waiting')
    RETURNING *
  `, [userId]);

  return result.rows[0];
};  

export const getQueueStatus = async (userId) => {
  const q = await db.query(`
    SELECT *,
      (
        SELECT COUNT(*) 
        FROM queue q2
        WHERE q2.status='waiting'
        AND q2.joined_at <= queue.joined_at
      ) AS position
    FROM queue
    WHERE user_id=$1 AND status='waiting'
  `, [userId]);

  return q.rows[0] || null;
};