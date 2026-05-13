
import {

    getAllSystemMetrics,
    getSystemStats,
    createSystemMetric

} from "../services/systemMetrics.service.js";

// 🔹 GET ALL
export const getMetrics = async (req, res) => {

    try {

        const data = await getAllSystemMetrics();

        res.json({
            success: true,
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Error obteniendo system metrics"
        });
    }
};

// 🔹 GET STATS
export const getStats = async (req, res) => {

    try {

        const data = await getSystemStats();

        res.json({
            success: true,
            data: {

                avg_cpu: Number(data.avg_cpu),

                avg_gpu: Number(data.avg_gpu),

                avg_temperature: Number(data.avg_temperature),

                avg_memory: Number(data.avg_memory),

                max_temperature: Number(data.max_temperature),

                max_cpu: Number(data.max_cpu)

            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Error estadísticas sistema"
        });
    }
};

// 🔹 CREATE
export const createMetric = async (req, res) => {

    try {

        const metric = await createSystemMetric(
            req.body
        );

        res.status(201).json({
            success: true,
            data: metric
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Error creando métrica sistema"
        });
    }
};