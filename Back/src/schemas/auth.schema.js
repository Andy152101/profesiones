/**
 * @file auth.schema.js
 * @description Define los esquemas de validación para la autenticación de usuarios (registro y login) utilizando Zod.
 */
import z from "zod";

/**
 * Esquema de validación para el registro de nuevos usuarios.
 * Define la estructura y las restricciones para `username`, `email` y `password`.
 */
export const registerSchema = z.object({
  // Validación para el nombre de usuario.
  username: z.string({
    required_error: "Username is required", // Mensaje de error si el nombre de usuario está ausente.
  }),
  // Validación para el correo electrónico.
  email: z
    .string({
      required_error: "Email is required", // Mensaje de error si el correo electrónico está ausente.
    })
    .email({
      message: "Invalid email", // Mensaje de error si el formato del correo electrónico es inválido.
    }),
  // Validación para la contraseña.
  password: z
    .string({
      required_error: "Password is required", // Mensaje de error si la contraseña está ausente.
    })
    .min(6, {
      message: "Password must be at least 6 characters", // Mensaje de error si la contraseña es demasiado corta.
    }),
});
/**
 * Esquema de validación para el inicio de sesión de usuarios.
 * Define la estructura y las restricciones para `email` y `password`.
 */
export const loginSchema = z.object({
  // Validación para el correo electrónico.
  email: z
    .string({
      required_error: "Email is required", // Mensaje de error si el correo electrónico está ausente.
    })
    .email({
      message: "Email is not valid", // Mensaje de error si el formato del correo electrónico es inválido.
    }),
  // Validación para la contraseña.
  password: z
    .string({
      required_error: "Password is required", // Mensaje de error si la contraseña está ausente.
    })
    .min(6, {
      message: "Password must be at least 6 characters", // Mensaje de error si la contraseña es demasiado corta.
    }),
});
