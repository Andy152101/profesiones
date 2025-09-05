// Importa Router de express y los controladores de tests
import { Router } from "express";
import {
  createTests,
  getTests,
  getTest,
  deleteTest,
  updateTest,
} from "../controllers/tests.controller.js";
import { authRequierd } from "../middlewares/validateToken.js"; // 👈 importa tu middleware

// Inicializa el router de Express para las rutas de tests
const router = Router();

// Obtiene todos los tests
router.get("/tests", authRequierd, getTests);

// Obtiene un test específico por ID
router.get("/tests/:id", authRequierd, getTest);

// Crea un nuevo test
router.post("/tests", authRequierd, createTests);

// Elimina un test por ID
router.delete("/tests/:id", authRequierd, deleteTest);

// Actualiza un test por ID
router.put("/tests/:id", authRequierd, updateTest);

// Exporta el router para ser usado en la app principal
export default router;
