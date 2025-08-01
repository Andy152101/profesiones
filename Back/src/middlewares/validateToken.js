// Importa jsonwebtoken para verificar tokens JWT y la clave secreta de configuración
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// Middleware para proteger rutas que requieren autenticación por JWT
// 1. Extrae el token de las cookies de la petición.
// 2. Si no hay token, responde con 401 (no autorizado).
// 3. Verifica el token usando la clave secreta.
// 4. Si el token no es válido, responde con 401.
// 5. Si es válido, agrega el usuario decodificado a req.user y continúa.
export const authRequierd = (req, res, next) => {
  // 1. Extrae el token de las cookies
  const { token } = req.cookies;
  // 2. Si no hay token, responde con 401
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  // 3. Verifica el token
  jwt.verify(token, TOKEN_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    // 5. Si es válido, agrega el usuario decodificado a req.user
    req.user = user; // Aquí debe estar el rol del usuario también
    next();
  });
};
