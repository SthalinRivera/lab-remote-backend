let estado = "OFF";

export const getEstado = (req, res) => {
  res.send(estado);
};

export const encender = (req, res) => {
  estado = "ON";
  console.log("LED ENCENDIDO");
  res.send("OK");
};

export const apagar = (req, res) => {
  estado = "OFF";
  console.log("LED APAGADO");
  res.send("OK");
};