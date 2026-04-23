import db from "../db.js";

setInterval(async () => {
  try {
    console.log("🟡 Worker ejecutándose...");

    const labRes = await db.query(`SELECT * FROM lab LIMIT 1`);
    if (labRes.rows.length === 0) return;

    const lab = labRes.rows[0];

    // 🔓 LAB LIBRE
    if (!lab.is_busy) {

      const next = await db.query(`
        SELECT * FROM queue
        WHERE status = 'waiting'
        ORDER BY joined_at ASC
        LIMIT 1
      `);

      if (next.rows.length > 0) {
        const user = next.rows[0];

        console.log("👉 Asignando:", user.user_id);

        // crear sesión
        const sessionRes = await db.query(`
          INSERT INTO sessions (id, user_id, started_at, ends_at, status)
          VALUES (uuid_generate_v4(), $1, now(), now() + interval '5 minutes', 'active')
          RETURNING id
        `, [user.user_id]);

        const sessionId = sessionRes.rows[0].id;

        // actualizar cola
        await db.query(`
          UPDATE queue SET status = 'active'
          WHERE id = $1
        `, [user.id]);

        // ocupar lab
        await db.query(`
          UPDATE lab
          SET is_busy = true,
              current_session_id = $1,
              updated_at = now()
          WHERE id = $2
        `, [sessionId, lab.id]);
      }
    }

    // 🔚 finalizar sesiones
    const finished = await db.query(`
      UPDATE sessions
      SET status = 'finished'
      WHERE ends_at < now() AND status = 'active'
      RETURNING id
    `);

    if (finished.rows.length > 0) {
      const active = await db.query(`
        SELECT * FROM sessions WHERE status = 'active'
      `);

      if (active.rows.length === 0) {
        await db.query(`
          UPDATE lab
          SET is_busy = false,
              current_session_id = NULL,
              updated_at = now()
        `);
      }
    }

  } catch (e) {
    console.error("❌ Worker error:", e);
  }
}, 3000);