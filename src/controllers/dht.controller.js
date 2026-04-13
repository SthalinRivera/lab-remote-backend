let datosDHT = {
  temperatura: 0,
  humedad: 0,
  fecha: null
};

// 📥 GET → obtener datos actuales
export const getDHT = (req, res) => {
  res.json(datosDHT);
};

// 📤 POST → recibir datos del ESP32
export const setDHT = (req, res) => {
  const { temperatura, humedad } = req.body;

  if (temperatura === undefined || humedad === undefined) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  datosDHT = {
    temperatura,
    humedad,
    fecha: new Date()
  };

  console.log("📡 Datos DHT recibidos:");
  console.log(datosDHT);

  res.json({ ok: true });
};