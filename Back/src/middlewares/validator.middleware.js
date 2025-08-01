// Middleware para validar el cuerpo de la petición contra un esquema (usando Zod)
// 1. Recibe un esquema de validación como parámetro.
// 2. Intenta validar req.body contra el esquema.
// 3. Si es válido, continúa con el siguiente middleware/controlador.
// 4. Si no es válido, responde con 400 y los mensajes de error.
export const validateSchema = (schema) => (req, res, next) => {
  try {
    // 2. Valida el cuerpo de la petición
    schema.parse(req.body);
    // 3. Si es válido, continúa
    next();
  } catch (error) {
    // 4. Si no es válido, responde con los mensajes de error
    return res.status(400).json(error.errors.map((error) => error.message));
  }
};
