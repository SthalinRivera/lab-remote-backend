import {
    getAllAiMetrics,
    getAiStats,
    createAiMetric
} from "../services/aiMetrics.service.js";

// 🔹 GET ALL
export const getMetrics = async (req, res) => {

    try {

        const data = await getAllAiMetrics();

        res.json({
            success: true,
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Error obteniendo métricas IA"
        });
    }
};

// 🔹 GET STATS
export const getStats = async (req, res) => {

    try {

        const data = await getAiStats();

        res.json({
            success: true,
            data: {
                total_records: Number(data.total_records),
                total_humans: Number(data.total_humans),
                total_led_on: Number(data.total_led_on),
                total_motion: Number(data.total_motion),
                avg_ai_fps: Number(data.avg_ai_fps),
                avg_inference_time: Number(data.avg_inference_time)
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Error estadísticas IA"
        });
    }
};

// 🔹 CREATE
export const createMetric = async (req, res) => {

    try {

        const metric = await createAiMetric(req.body);

        res.status(201).json({
            success: true,
            data: metric
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Error creando métrica IA"
        });
    }
};