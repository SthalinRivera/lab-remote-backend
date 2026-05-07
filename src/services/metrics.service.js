import pool from "../db.js";

// 🔹 MÉTRICAS DE UN USUARIO
export const getUserMetrics = async (userId) => {
    const result = await pool.query(
        `SELECT 
        COUNT(DISTINCT s.id) AS total_sessions,
        COALESCE(SUM(EXTRACT(EPOCH FROM (s.ends_at - s.started_at))),0) AS total_time,
        COALESCE(AVG(EXTRACT(EPOCH FROM (s.ends_at - s.started_at))),0) AS avg_time,
        COUNT(DISTINCT q.id) AS times_in_queue,
        COALESCE(SUM(um.active_time_seconds),0) AS active_time,
        COALESCE(SUM(um.idle_time_seconds),0) AS idle_time,
        COALESCE(SUM(um.interactions),0) AS interactions,
        u.last_login
     FROM users u
     LEFT JOIN sessions s ON u.id = s.user_id
     LEFT JOIN usage_metrics um ON s.id = um.session_id
     LEFT JOIN queue q ON u.id = q.user_id
     WHERE u.id = $1
     GROUP BY u.id`,
        [userId]
    );

    return result.rows[0];
};

// 🔹 MÉTRICAS DE TODOS LOS USUARIOS
export const getAllUsersMetrics = async () => {
    const result = await pool.query(
        `SELECT 
        u.id,
        u.email,

        COUNT(DISTINCT s.id) AS total_sessions,
        COALESCE(SUM(EXTRACT(EPOCH FROM (s.ends_at - s.started_at))),0) AS total_time,
        COALESCE(AVG(EXTRACT(EPOCH FROM (s.ends_at - s.started_at))),0) AS avg_time,

        COUNT(DISTINCT q.id) AS times_in_queue,

        COALESCE(SUM(um.active_time_seconds),0) AS active_time,
        COALESCE(SUM(um.idle_time_seconds),0) AS idle_time,
        COALESCE(SUM(um.interactions),0) AS interactions,

        u.last_login

     FROM users u
     LEFT JOIN sessions s ON u.id = s.user_id
     LEFT JOIN usage_metrics um ON s.id = um.session_id
     LEFT JOIN queue q ON u.id = q.user_id

     GROUP BY u.id, u.email, u.last_login
     ORDER BY total_time DESC`
    );

    return result.rows;
};