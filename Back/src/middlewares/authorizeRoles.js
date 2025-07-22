// middlewares/authorizeRoles.js
export const authorizeRoles = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "No estás autorizado" });
    }

    const userRole = req.user.role; // Asegúrate de que este valor se obtenga correctamente

    if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Acceso denegado" }); // Forbidden
    }

    next(); // Permite el acceso si el rol está permitido
};

