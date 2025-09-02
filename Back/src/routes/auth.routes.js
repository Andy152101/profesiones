// Importa Router de express, middlewares y controladores de autenticación
import { Router } from "express";
import {
  login,
  register,
  logout,
  profile,
  verifyToken,
  getAllRegisters,
  viewRegister,
  deleteRegisters,
  updateRegisters,
  validateAccessCode,
  registerEmployee,
  registerConsultant,
} from "../controllers/auth.controller.js";
import { authRequierd } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

// Inicializa el router de Express para las rutas de autenticación
const router = Router();
// Registra un nuevo usuario (requiere autenticación y validación de esquema)
router.post(
  "/register",
  validateSchema(registerSchema),
  authRequierd,
  register
);
router.post("/register-employee", registerEmployee);
// Obtiene todos los registros de usuarios
router.get("/registers", authRequierd, getAllRegisters);
// Registra un nuevo consultor
router.post("/register-consultant", registerConsultant);
// Obtiene un registro específico por ID
router.get("/registers/:id", authRequierd, viewRegister);
// Elimina un registro por ID
router.delete("/registers/:id", deleteRegisters);
// Actualiza un registro por ID
router.put("/registers/:id", authRequierd, updateRegisters);
// Inicia sesión (login) con validación de esquema
router.post("/login", validateSchema(loginSchema), login);
// Cierra sesión (logout)
router.post("/logout", logout);
// Verifica el token de autenticación
router.get("/verify", verifyToken);
// Obtiene el perfil del usuario autenticado
router.get("/profile", authRequierd, profile);

// Valida un código de acceso
router.post("/validate-access-code", validateAccessCode);

// Exporta el router para ser usado en la app principal
export default router;
