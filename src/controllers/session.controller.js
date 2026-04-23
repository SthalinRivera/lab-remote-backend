// controllers/session.controller.js
import { getActiveSession } from "../services/session.service.js";

export const current = async (req, res) => {
  try {
    const data = await getActiveSession(req.user.id);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error session" });
  }
};