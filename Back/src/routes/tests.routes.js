// Importa Router de express y los controladores de tests
import { Router } from "express";
import {
  createTests,
  getTests,
  getTest,
  deleteTest,
  updateTest,
} from "../controllers/tests.controller.js";

// Inicializa el router de Express para las rutas de tests
const router = Router();

// Obtiene todos los tests
router.get("/tests", getTests);

// Obtiene un test específico por ID
router.get("/tests/:id", getTest);

// Crea un nuevo test
router.post("/tests", createTests);

// Elimina un test por ID
router.delete("/tests/:id", deleteTest);

// Actualiza un test por ID
router.put("/tests/:id", updateTest);

// Exporta el router para ser usado en la app principal
export default router;
