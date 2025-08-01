/**
 * @file task.schema.js
 * @description Define el esquema de validación para la creación de tareas utilizando Zod.
 */

import z from "zod";

/**
 * Esquema de validación para la creación de nuevas tareas.
 * Define la estructura y las restricciones para `title`, `description` y `date`.
 */
export const createtaskSchema = z.object({
  // Validación para el título de la tarea.
  title: z.string({
    required_error: "title is required", // Mensaje de error si el título está ausente.
  }),

  // Validación para la descripción de la tarea.
  description: z.string({
    required_error: "description is require", // Mensaje de error si la descripción está ausente.
  }),
  // Validación para la fecha de la tarea. Es opcional y debe ser un formato de fecha y hora válido.
  date: z.string().datetime().optional(),
});
