// controllers/videoMetrics.controller.js

import {
    getAllVideoMetrics,
    getVideoStatsService,
    createVideoMetricService
} from "../services/videoMetrics.service.js";

// 🔹 GET ALL
export const getVideoMetrics = async (req, res) => {

    try {

        const data = await getAllVideoMetrics();

        res.json({
            success: true,
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Error obteniendo métricas de video"
        });
    }
};

// 🔹 GET STATS
export const getVideoStats = async (req, res) => {

    try {

        const data = await getVideoStatsService();

        res.json({
            success: true,
            data: {
                total_records: Number(data.total_records),
                avg_latency_ms: Number(data.avg_latency_ms),
                avg_fps: Number(data.avg_fps),
                avg_jitter_ms: Number(data.avg_jitter_ms),
                avg_packet_loss: Number(data.avg_packet_loss),
                max_latency_ms: Number(data.max_latency_ms),
                min_latency_ms: Number(data.min_latency_ms)
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Error obteniendo estadísticas"
        });
    }
};

// 🔹 CREATE
export const createVideoMetric = async (req, res) => {

    try {

        const metric = await createVideoMetricService(req.body);

        res.status(201).json({
            success: true,
            data: metric
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Error creando métrica"
        });
    }
};