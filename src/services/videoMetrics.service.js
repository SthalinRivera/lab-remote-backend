// services/videoMetrics.service.js

import pool from "../db.js";

// 🔹 OBTENER TODAS LAS MÉTRICAS
export const getAllVideoMetrics = async () => {

    const result = await pool.query(`
        SELECT
            id,
            session_id,
            latency_ms,
            fps,
            jitter_ms,
            packet_loss,
            created_at
        FROM video_metrics
        ORDER BY created_at DESC
    `);

    return result.rows;
};

// 🔹 ESTADÍSTICAS
export const getVideoStatsService = async () => {

    const result = await pool.query(`
        SELECT

            COUNT(*) AS total_records,

            AVG(latency_ms) AS avg_latency_ms,

            AVG(fps) AS avg_fps,

            AVG(jitter_ms) AS avg_jitter_ms,

            AVG(packet_loss) AS avg_packet_loss,

            MAX(latency_ms) AS max_latency_ms,

            MIN(latency_ms) AS min_latency_ms

        FROM video_metrics
    `);

    return result.rows[0];
};

// 🔹 INSERTAR MÉTRICA
export const createVideoMetricService = async ({
    session_id,
    latency_ms,
    fps,
    jitter_ms,
    packet_loss
}) => {

    const result = await pool.query(`
        INSERT INTO video_metrics (
            session_id,
            latency_ms,
            fps,
            jitter_ms,
            packet_loss
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [
        session_id,
        latency_ms,
        fps,
        jitter_ms,
        packet_loss
    ]);

    return result.rows[0];
};