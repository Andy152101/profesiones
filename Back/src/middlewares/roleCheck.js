// Middleware para verificar roles de usuario
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Convertir a array si se pasa un solo rol
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Acceso denegado. Rol requerido: " + allowedRoles.join(" o "),
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario pertenezca a la misma empresa
export const requireSameCompany = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Admin puede acceder a cualquier empresa
    if (req.user.role === "admin") {
      return next();
    }

    // Empleados no pueden usar este middleware (no tienen acceso a datos de empresa)
    if (req.user.role === "empleado") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Para consultor-empresa, verificar que acceda solo a su empresa
    if (req.user.role === "consultorEmpresa") {
      const companyRef = req.params.companyRef || req.body.companyRef;

      if (companyRef && companyRef !== req.user.companyRef.toString()) {
        return res.status(403).json({
          message: "Solo puede acceder a datos de su propia empresa",
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware para verificar que el usuario necesita cambiar contraseña
export const requirePasswordChange = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  // Verificar si el usuario necesita cambiar contraseña
  if (req.user.role === "empleado" && !req.user.needsPasswordChange) {
    return res.status(423).json({
      message: "Debe cambiar su contraseña antes de continuar",
      requirePasswordChange: true,
    });
  }

  next();
};

// Middleware para verificar que el usuario NO necesita cambiar contraseña
// (para permitir acceso solo al endpoint de cambio de contraseña)
export const allowOnlyPasswordChange = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  // Si el usuario no necesita cambiar contraseña, denegar acceso
  if (req.user.role !== "empleado" || req.user.defaultPasswordSet) {
    return res.status(400).json({
      message: "No necesita cambiar su contraseña",
    });
  }

  next();
};
