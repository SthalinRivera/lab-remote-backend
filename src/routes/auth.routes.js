import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Dominios que requieren autorización
const REQUIRES_AUTH_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
// Dominios institucionales (acceso directo)
const INSTITUTIONAL_DOMAINS = ['undc.edu.pe'];

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const domain = email.split('@')[1];
    const google_id = payload.sub;
    const name = payload.name;
    const avatar = payload.picture;

    // Verificar si es dominio institucional (acceso directo)
    const isInstitutional = INSTITUTIONAL_DOMAINS.includes(domain);
    const requiresAuth = REQUIRES_AUTH_DOMAINS.includes(domain);

    // Si no es ni institucional ni requiere autorización, rechazar
    if (!isInstitutional && !requiresAuth) {
      return res.status(403).json({
        error: "domain_not_allowed",
        message: `El dominio ${domain} no está autorizado. Solo correos @undc.edu.pe o autorizados.`
      });
    }

    // Buscar usuario en la base de datos
    let result = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    let user;

    if (result.rows.length === 0) {
      // Usuario nuevo - determinar status según dominio
      const status = isInstitutional ? 'active' : 'pending';

      const insertResult = await db.query(`
        INSERT INTO users (google_id, email, name, avatar_url, last_login, role, status)
        VALUES ($1, $2, $3, $4, now(), 'student', $5)
        RETURNING id, email, name, avatar_url, role, status, created_at
      `, [google_id, email, name, avatar, status]);

      user = insertResult.rows[0];

      // Si requiere autorización, responder con mensaje
      if (status === 'pending') {
        return res.status(403).json({
          error: "pending_approval",
          message: `📝 Hola ${name}, tu cuenta requiere autorización administrativa. Recibirás un correo cuando sea aprobada.`,
          user
        });
      }
    } else {
      // Usuario existe
      user = result.rows[0];

      // Verificar si está pendiente
      if (user.status === 'pending') {
        return res.status(403).json({
          error: "pending_approval",
          message: `⏳ Tu cuenta está pendiente de autorización. Espera a que un administrador la active.`,
          user
        });
      }

      if (user.status === 'rejected') {
        return res.status(403).json({
          error: "rejected",
          message: `❌ Tu solicitud de acceso ha sido rechazada. Contacta al administrador.`,
          user
        });
      }

      // Actualizar last_login y google_id
      await db.query(
        `UPDATE users SET last_login = now(), google_id = $1 WHERE id = $2`,
        [google_id, user.id]
      );
    }

    // Usuario autorizado - generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      error: "server_error",
      message: "Error interno del servidor."
    });
  }
});

// Obtener usuarios pendientes (solo correos que requieren autorización)
router.get("/pending", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, name, avatar_url, role, status, created_at 
       FROM users 
       WHERE status = 'pending'
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;