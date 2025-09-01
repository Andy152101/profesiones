import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js"; // 👈 asegúrate de importar el modelo

export const authRequierd = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verifica y decodifica el token
    const decoded = jwt.verify(token, TOKEN_SECRET);

    // Si no tiene companyRef en el token (ej: token viejo), lo buscamos en la DB
    if (!decoded.companyRef && decoded.role !== "admin") {
      const dbUser = await User.findById(decoded.id).select("companyRef role");
      decoded.companyRef = dbUser?.companyRef || null;
    }

    req.user = decoded; // 👈 aquí ya tienes id, role y companyRef
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export const validateToken = authRequierd;
