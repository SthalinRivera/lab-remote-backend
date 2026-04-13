// controllers/message.controller.js

let mensaje = "";

// ✅ EXPORT CORRECTO
export const getMensaje = (req, res) => {
  res.json({ mensaje });
};

export const setMensaje = (req, res) => {
  const { texto } = req.body;

  mensaje = texto;

  console.log("💬 Mensaje:", mensaje);

  res.json({ ok: true });
};