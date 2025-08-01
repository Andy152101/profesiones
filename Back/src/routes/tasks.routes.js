// Importa Router de express, middlewares y controladores de tareas
import { Router } from "express";
import { authRequierd } from "../middlewares/validateToken.js";
import {
  getTask,
  getTasks,
  createTasks,
  deleteTasks,
  updateTasks,
} from "../controllers/tasks.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createtaskSchema } from "../schemas/task.schema.js";

// Inicializa el router de Express para las rutas de tareas
const router = Router();

// Obtiene todas las tareas del usuario autenticado
router.get("/tasks", authRequierd, getTasks);

// Obtiene una tarea específica por ID (usuario autenticado)
router.get("/tasks/:id", authRequierd, getTask);

// Crea una nueva tarea (usuario autenticado, con validación de esquema)
router.post(
  "/tasks",
  authRequierd,
  validateSchema(createtaskSchema),
  createTasks
);

// Elimina una tarea por ID (usuario autenticado)
router.delete("/tasks/:id", authRequierd, deleteTasks);

// Actualiza una tarea por ID (usuario autenticado)
router.put("/tasks/:id", authRequierd, updateTasks);

// Exporta el router para ser usado en la app principal
export default router;
