// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  console.log('🔐 MIDDLEWARE EJECUTÁNDOSE');

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: "Token no proporcionado",
        code: "NO_TOKEN"
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET no configurado');
      return res.status(500).json({
        success: false,
        error: "Error de configuración"
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Manejar específicamente error de expiración
      if (jwtError.name === 'TokenExpiredError') {
        console.log('⏰ Token expirado');
        return res.status(401).json({
          success: false,
          error: "Token expirado. Por favor, inicia sesión nuevamente.",
          code: "TOKEN_EXPIRED"
        });
      }
      throw jwtError;
    }

    // Configurar req.user
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    console.log('✅ Usuario autenticado:', req.user);
    next();

  } catch (error) {
    console.error('❌ Error en middleware:', error.message);
    return res.status(401).json({
      success: false,
      error: "Token inválido",
      code: "INVALID_TOKEN"
    });
  }
};

export default auth;