// Importa Router de express y los controladores de personas
import { Router } from "express";
import {
  createPeople,
  getPeoples,
  getPeople,
  deletePeople,
  updatePeople,
  getPeopleByDocNumber,
} from "../controllers/people.controller.js";
import { authRequierd } from "../middlewares/validateToken.js";

// Inicializa el router de Express para las rutas de personas
const router = Router();

// Obtiene todas las personas (admin y editor)
router.get("/people", authRequierd, getPeoples);

// Obtiene una persona por ID (admin y editor)
router.get("/people/:id", authRequierd, getPeople);

// Crea una nueva persona (solo admin)
router.post("/people", createPeople);

// Elimina una persona por ID (solo admin)
router.delete("/people/:id", deletePeople);

// Actualiza una persona por ID (admin y editor)
router.put("/people/:id", updatePeople);

// Busca una persona por número de documento (admin y editor)
router.get("/people/search/:docNumber", getPeopleByDocNumber);

// Exporta el router para ser usado en la app principal
export default router;
