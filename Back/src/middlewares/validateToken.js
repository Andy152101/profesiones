import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";

export const authRequierd = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      console.warn("⚠️ No token en cookies");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // 🔐 Verifica y decodifica el token
    const decoded = jwt.verify(token, TOKEN_SECRET);
    console.log("🔓 Token decodificado:", decoded);

    // 🔎 Si falta info sensible en el token (ej: companyRef o peopleRef), la traemos de la DB
    if (
      (!decoded.companyRef || !decoded.peopleRef) &&
      decoded.role !== "admin"
    ) {
      console.log("🔎 Token incompleto, consultando DB...");
      const dbUser = await User.findById(decoded.id).select(
        "companyRef role peopleRef"
      );
      decoded.companyRef = dbUser?.companyRef || null;
      decoded.peopleRef = dbUser?.peopleRef || null; // 👈 aquí agregamos
      console.log(
        "📦 companyRef:",
        decoded.companyRef,
        "👤 peopleRef:",
        decoded.peopleRef
      );
    }

    req.user = decoded;
    console.log("✅ req.user final:", req.user);

    next();
  } catch (error) {
    console.error("❌ Error en authRequierd:", error.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export const validateToken = authRequierd;
