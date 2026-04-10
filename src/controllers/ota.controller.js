import bucket from "../firebase.js";

let firmwareURL = "";

export const subirFirmware = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file");
    }

    const file = bucket.file("firmware.bin");

    await file.save(req.file.buffer);

    // Hacer público
    await file.makePublic();

    firmwareURL = file.publicUrl();

    res.json({ url: firmwareURL });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error subiendo firmware");
  }
};

export const getFirmwareURL = (req, res) => {
  res.json({ url: firmwareURL });
};