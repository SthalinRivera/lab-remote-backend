// services/lab.service.js
import db from "../db.js";

export const LabService = {

    // Obtener configuración actual del laboratorio
    async getConfig() {
        const res = await db.query(`
            SELECT id, name, is_busy, session_duration_seconds, 
                   vm_url, webcam_url, current_session_id, updated_at
            FROM lab LIMIT 1
        `);

        if (res.rows.length === 0) {
            // Si no existe, crear configuración por defecto
            const insertRes = await db.query(`
                INSERT INTO lab (name, session_duration_seconds)
                VALUES ('Lab IoT IA', 300)
                RETURNING *
            `);
            return insertRes.rows[0];
        }

        return res.rows[0];
    },

    // Actualizar configuración del laboratorio
    async updateConfig(id, updates) {
        // SOLO campos que existen en tu tabla
        const allowedFields = ['name', 'session_duration_seconds', 'vm_url', 'webcam_url'];

        const fields = [];
        const values = [];
        let idx = 1;

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                fields.push(`${field} = $${idx}`);
                values.push(updates[field]);
                idx++;
            }
        }

        if (fields.length === 0) {
            throw new Error('No valid fields to update');
        }

        values.push(id);
        const query = `
            UPDATE lab
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE id = $${idx}
            RETURNING id, name, is_busy, session_duration_seconds, 
                      vm_url, webcam_url, current_session_id, updated_at
        `;

        const res = await db.query(query, values);

        if (res.rows.length === 0) {
            throw new Error('Lab configuration not found');
        }

        return res.rows[0];
    },

    // Obtener estado actual (público)
    async getStatus() {
        const config = await this.getConfig();

        // Contar cola de espera
        const queueCount = await db.query(
            `SELECT COUNT(*) FROM queue WHERE status = 'waiting'`
        );

        // Verificar sesión activa
        const activeSession = await db.query(`
            SELECT s.id, u.name, u.email, s.started_at, s.ends_at
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.status = 'active' 
            AND s.ends_at > NOW()
            ORDER BY s.started_at DESC
            LIMIT 1
        `);

        return {
            id: config.id,
            name: config.name,
            is_busy: config.is_busy,
            current_session: activeSession.rows[0] || null,
            queue_length: parseInt(queueCount.rows[0].count),
            session_duration_seconds: config.session_duration_seconds,
            vm_url: config.vm_url,
            webcam_url: config.webcam_url,
            updated_at: config.updated_at
        };
    },

    // Actualizar estado busy (usado por el sistema)
    async updateBusyStatus(id, isBusy, sessionId = null) {
        const res = await db.query(
            `UPDATE lab 
             SET is_busy = $1, 
                 current_session_id = $2,
                 updated_at = NOW()
             WHERE id = $3
             RETURNING id, name, is_busy, current_session_id`,
            [isBusy, sessionId, id]
        );

        if (res.rows.length === 0) {
            throw new Error('Lab configuration not found');
        }

        return res.rows[0];
    },

    // Validar URLs
    isValidUrl(url) {
        if (!url) return true;
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    },

    // Validar duración de sesión
    isValidDuration(seconds) {
        return seconds >= 60 && seconds <= 3600;
    }
};