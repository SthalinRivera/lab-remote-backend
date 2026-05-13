import pool from "../db.js";

// 🔹 OBTENER TODAS LAS MÉTRICAS IA
export const getAllAiMetrics = async () => {

    const result = await pool.query(`
        SELECT
            id,
            human_detected,
            led_on,
            motion_detected,
            ai_fps,
            inference_time,
            created_at
        FROM ai_metrics
        ORDER BY created_at DESC
    `);

    return result.rows;
};

// 🔹 ESTADÍSTICAS GENERALES IA
export const getAiStats = async () => {

    const result = await pool.query(`
        SELECT

            COUNT(*) AS total_records,

            SUM(
                CASE
                    WHEN human_detected = true
                    THEN 1
                    ELSE 0
                END
            ) AS total_humans,

            SUM(
                CASE
                    WHEN led_on = true
                    THEN 1
                    ELSE 0
                END
            ) AS total_led_on,

            SUM(
                CASE
                    WHEN motion_detected = true
                    THEN 1
                    ELSE 0
                END
            ) AS total_motion,

            AVG(ai_fps) AS avg_ai_fps,

            AVG(inference_time) AS avg_inference_time

        FROM ai_metrics
    `);

    return result.rows[0];
};

// 🔹 INSERTAR MÉTRICA IA
export const createAiMetric = async ({
    human_detected,
    led_on,
    motion_detected,
    ai_fps,
    inference_time
}) => {

    const result = await pool.query(`
        INSERT INTO ai_metrics (
            human_detected,
            led_on,
            motion_detected,
            ai_fps,
            inference_time
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [
        human_detected,
        led_on,
        motion_detected,
        ai_fps,
        inference_time
    ]);

    return result.rows[0];
};