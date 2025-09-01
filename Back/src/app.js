/**
 * @file app.js
 * @description Archivo principal de la aplicación backend. Configura el servidor Express, middlewares y rutas.
 */

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import peopleRoutes from "./routes/people.routes.js";
import testsRoutes from "./routes/tests.routes.js";
import companyRoutes from "./routes/company.routes.js";
import cors from "cors";

// Inicializa la aplicación Express
const app = express();
// Configuración de CORS (Cross-Origin Resource Sharing)
// Permite solicitudes desde el frontend que se ejecuta en http://localhost:5173
// `credentials: true` permite el envío de cookies de autenticación.
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Middleware para el registro de solicitudes HTTP en formato 'dev' (conciso y coloreado).
app.use(morgan("dev"));

// Middleware para parsear el cuerpo de las solicitudes con formato JSON.
app.use(express.json());

// Middleware para parsear las cookies de las solicitudes.
app.use(cookieParser());

// Rutas de la API
// Cada ruta se prefija con '/api' y se asocia a un conjunto de rutas específicas.
app.use("/api/companies", companyRoutes); // Rutas para la gestión de empresas
app.use("/api", authRoutes); // Rutas para autenticación (registro, login, etc.)
app.use("/api", tasksRoutes); // Rutas para la gestión de tareas
app.use("/api", peopleRoutes); // Rutas para la gestión de personas
app.use("/api", testsRoutes); // Rutas para la gestión de pruebas

export default app;
