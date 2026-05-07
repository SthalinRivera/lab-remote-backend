import db from "../db.js";

export const DashboardService = {

    // Obtener estadísticas completas del dashboard
    async getStats() {
        const client = await db.connect();
        try {
            // 1. Estadísticas de usuarios
            const usersStats = await client.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE role = 'admin') as admins,
          COUNT(*) FILTER (WHERE role = 'student') as students
        FROM users
      `);

            // 2. Sesiones activas (status = 'active')
            const sessionsStats = await client.query(`
        SELECT 
          COUNT(*) as active_sessions,
          COALESCE(AVG(duration_seconds), 0) as avg_session_duration
        FROM sessions 
        WHERE status = 'active'
      `);

            // 3. Cola de espera (status = 'waiting')
            const queueStats = await client.query(`
        SELECT 
          COUNT(*) as queue_length
        FROM queue 
        WHERE status = 'waiting'
      `);

            // 4. Usuarios recientes (últimos 5)
            const recentUsers = await client.query(`
        SELECT id, email, name, avatar_url, role, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      `);

            // 5. Tendencias de usuarios (últimos 7 días)
            const trends = await client.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as new_users
        FROM users
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `);

            return {
                stats: {
                    totalUsers: parseInt(usersStats.rows[0].total_users) || 0,
                    admins: parseInt(usersStats.rows[0].admins) || 0,
                    students: parseInt(usersStats.rows[0].students) || 0,
                    activeSessions: parseInt(sessionsStats.rows[0].active_sessions) || 0,
                    avgSessionMinutes: Math.round(parseFloat(sessionsStats.rows[0].avg_session_duration) / 60) || 0,
                    queueLength: parseInt(queueStats.rows[0].queue_length) || 0
                },
                recentUsers: recentUsers.rows,
                trends: trends.rows
            };
        } catch (error) {
            console.error('Error en DashboardService.getStats:', error);
            throw error;
        } finally {
            client.release();
        }
    },

    // Obtener estadísticas de usuarios
    async getUserStats() {
        const result = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE role = 'admin') as admins,
        COUNT(*) FILTER (WHERE role = 'student') as students,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_last_7_days,
        COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '7 days') as active_last_7_days
      FROM users
    `);
        return result.rows[0];
    },

    // Obtener estadísticas de sesiones
    async getSessionStats() {
        const result = await db.query(`
      SELECT 
        COUNT(*) as active_sessions,
        COUNT(*) FILTER (WHERE started_at >= NOW() - INTERVAL '24 hours') as sessions_last_24h,
        COALESCE(AVG(duration_seconds), 0) as avg_duration_seconds
      FROM sessions 
      WHERE status = 'active'
    `);
        return result.rows[0];
    },

    // Obtener estadísticas de cola
    async getQueueStats() {
        const result = await db.query(`
      SELECT 
        COUNT(*) as waiting_count,
        COUNT(*) FILTER (WHERE joined_at >= NOW() - INTERVAL '1 hour') as joined_last_hour
      FROM queue 
      WHERE status = 'waiting'
    `);
        return result.rows[0];
    },

    // Obtener estado del laboratorio
    async getLabStatus() {
        const result = await db.query(`
      SELECT 
        id,
        name,
        is_busy,
        current_session_id,
        updated_at
      FROM lab 
      LIMIT 1
    `);
        return result.rows[0] || null;
    },

    // Obtener sesiones activas con detalles de usuario
    async getActiveSessions() {
        const result = await db.query(`
      SELECT 
        s.id,
        s.user_id,
        s.started_at,
        s.ends_at,
        s.duration_seconds,
        s.status,
        u.name as user_name,
        u.email as user_email,
        u.avatar_url
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.status = 'active'
      ORDER BY s.started_at ASC
    `);
        return result.rows;
    },

    // Obtener cola con detalles de usuario
    async getQueueWithUsers() {
        const result = await db.query(`
      SELECT 
        q.id,
        q.user_id,
        q.status,
        q.joined_at,
        u.name as user_name,
        u.email as user_email,
        u.avatar_url
      FROM queue q
      JOIN users u ON q.user_id = u.id
      WHERE q.status = 'waiting'
      ORDER BY q.joined_at ASC
    `);
        return result.rows;
    },

    // Obtener resumen completo del sistema
    async getSystemSummary() {
        const [users, sessions, queue, lab] = await Promise.all([
            this.getUserStats(),
            this.getSessionStats(),
            this.getQueueStats(),
            this.getLabStatus()
        ]);

        return {
            users,
            sessions,
            queue,
            lab,
            timestamp: new Date().toISOString()
        };
    },

    // Obtener métricas de uso por día (últimos 30 días)
    async getUsageMetrics(days = 30) {
        const result = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_sessions,
        SUM(active_time_seconds) as total_active_time
      FROM usage_metrics
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
        return result.rows;
    },

    // Obtener métricas del sistema (Jetson)
    async getSystemMetrics(limit = 100) {
        const result = await db.query(`
      SELECT 
        cpu_usage,
        gpu_usage,
        temperature,
        memory_usage,
        created_at
      FROM system_metrics
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);
        return result.rows;
    }
};