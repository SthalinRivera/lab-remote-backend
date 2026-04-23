import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const google_id = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture;

    // UPSERT usuario
    const result = await db.query(`
      INSERT INTO users (google_id, email, name, avatar_url, last_login)
      VALUES ($1,$2,$3,$4,now())
      ON CONFLICT (google_id)
      DO UPDATE SET last_login = now()
      RETURNING *;
    `, [google_id, email, name, avatar]);

    const user = result.rows[0];

    // JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });

  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Login failed" });
  }
});

export default router;