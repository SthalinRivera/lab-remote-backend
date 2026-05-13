import pool from "../db.js";

// 🔹 OBTENER TODAS LAS MÉTRICAS
export const getAllSystemMetrics = async () => {

    const result = await pool.query(`
        SELECT
            id,
            cpu_usage,
            gpu_usage,
            temperature,
            memory_usage,
            created_at
        FROM system_metrics
        ORDER BY created_at DESC
    `);

    return result.rows;
};

// 🔹 ESTADÍSTICAS
export const getSystemStats = async () => {

    const result = await pool.query(`
        SELECT

            AVG(cpu_usage) AS avg_cpu,

            AVG(gpu_usage) AS avg_gpu,

            AVG(temperature) AS avg_temperature,

            AVG(memory_usage) AS avg_memory,

            MAX(temperature) AS max_temperature,

            MAX(cpu_usage) AS max_cpu

        FROM system_metrics
    `);

    return result.rows[0];
};

// 🔹 INSERTAR MÉTRICA
export const createSystemMetric = async ({
    cpu_usage,
    gpu_usage,
    temperature,
    memory_usage
}) => {

    const result = await pool.query(`
        INSERT INTO system_metrics (

            cpu_usage,
            gpu_usage,
            temperature,
            memory_usage

        )
        VALUES ($1, $2, $3, $4)

        RETURNING *
    `, [
        cpu_usage,
        gpu_usage,
        temperature,
        memory_usage
    ]);

    return result.rows[0];
};