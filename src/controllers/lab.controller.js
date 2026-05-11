// controllers/lab.controller.js
import { LabService } from "../services/lab.service.js";

export const LabController = {

    // Obtener configuración completa (admin)
    async getConfig(req, res) {
        try {
            const config = await LabService.getConfig();
            res.json({
                success: true,
                data: config,
                message: "Lab configuration retrieved"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    },

    // Actualizar configuración (admin)
    async updateConfig(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            // Validar duración de sesión
            if (updates.session_duration_seconds !== undefined) {
                if (!LabService.isValidDuration(updates.session_duration_seconds)) {
                    return res.status(400).json({
                        success: false,
                        message: "Session duration must be between 60 and 3600 seconds"
                    });
                }
            }

            // Validar URLs
            if (updates.vm_url !== undefined && updates.vm_url !== "") {
                if (!LabService.isValidUrl(updates.vm_url)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid VM URL format"
                    });
                }
            }

            if (updates.webcam_url !== undefined && updates.webcam_url !== "") {
                if (!LabService.isValidUrl(updates.webcam_url)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Webcam URL format"
                    });
                }
            }

            const updated = await LabService.updateConfig(id, updates);
            res.json({
                success: true,
                data: updated,
                message: "Lab configuration updated successfully"
            });
        } catch (err) {
            if (err.message === 'Lab configuration not found') {
                return res.status(404).json({
                    success: false,
                    message: err.message
                });
            }
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    },

    // Obtener estado público
    async getStatus(req, res) {
        try {
            const status = await LabService.getStatus();
            res.json({
                success: true,
                data: status,
                message: "Lab status retrieved"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    },

    // Actualizar estado busy (sistema)
    async updateBusyStatus(req, res) {
        try {
            const { id } = req.params;
            const { is_busy, session_id } = req.body;

            if (typeof is_busy !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: "is_busy must be a boolean"
                });
            }

            const updated = await LabService.updateBusyStatus(id, is_busy, session_id || null);
            res.json({
                success: true,
                data: updated,
                message: `Lab is now ${is_busy ? 'busy' : 'available'}`
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }
};