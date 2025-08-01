// middlewares/authorizeRoles.js
// Middleware para permitir acceso solo a ciertos roles
// 1. Verifica que el usuario esté autenticado (req.user).
// 2. Obtiene el rol del usuario autenticado.
// 3. Si el rol no está en la lista de roles permitidos, responde con 403.
// 4. Si está permitido, continúa con el siguiente middleware/controlador.
export const authorizeRoles = (roles) => (req, res, next) => {
  // 1. Verifica que el usuario esté autenticado
  if (!req.user) {
    return res.status(401).json({ message: "No estás autorizado" });
  }
  // 2. Obtiene el rol del usuario
  const userRole = req.user.role;
  // 3. Si el rol no está permitido, responde con 403
  if (!roles.includes(userRole)) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  // Permite el acceso si el rol está permitido
  // 4. Continúa con el siguiente middleware/controlador
  next();
};
