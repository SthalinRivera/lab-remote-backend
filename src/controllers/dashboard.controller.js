import { DashboardService } from "../services/dashboard.service.js";

export const DashboardController = {

    async getStats(req, res) {
        try {
            const data = await DashboardService.getStats();
            res.json(data);
        } catch (error) {
            console.error('Error en getStats:', error);
            res.status(500).json({
                error: 'Error al obtener estadísticas',
                message: error.message
            });
        }
    },

    async getUserStats(req, res) {
        try {
            const stats = await DashboardService.getUserStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getSessionStats(req, res) {
        try {
            const stats = await DashboardService.getSessionStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getQueueStats(req, res) {
        try {
            const stats = await DashboardService.getQueueStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getLabStatus(req, res) {
        try {
            const lab = await DashboardService.getLabStatus();
            res.json(lab);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getActiveSessions(req, res) {
        try {
            const sessions = await DashboardService.getActiveSessions();
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getQueueWithUsers(req, res) {
        try {
            const queue = await DashboardService.getQueueWithUsers();
            res.json(queue);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getSystemSummary(req, res) {
        try {
            const summary = await DashboardService.getSystemSummary();
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getUsageMetrics(req, res) {
        try {
            const days = req.query.days || 30;
            const metrics = await DashboardService.getUsageMetrics(days);
            res.json(metrics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getSystemMetrics(req, res) {
        try {
            const limit = req.query.limit || 100;
            const metrics = await DashboardService.getSystemMetrics(limit);
            res.json(metrics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};