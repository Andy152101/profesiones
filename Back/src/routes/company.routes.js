import { Router } from "express";
import {
  //requestCompanyRegistration,
  approveCompany,
  getPendingCompanies,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  getCompanyStats,
  createCompany,
} from "../controllers/company.controller.js";
import { validateToken } from "../middlewares/validateToken.js";
import { requireRole, requireSameCompany } from "../middlewares/roleCheck.js";

const router = Router();

// Rutas públicas (sin autenticación) - DEBEN IR ANTES del middleware validateToken
//router.post("/request-registration", requestCompanyRegistration);

// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(validateToken);

// Rutas solo para administradores
router.post("/", requireRole("admin"), createCompany);
router.get("/", requireRole("admin"), getAllCompanies);
router.delete("/:id", requireRole("admin"), deleteCompany);
router.get("/stats", requireRole("admin"), getCompanyStats);

// Rutas para admin y consultor-empresa
router.get("/:id", requireRole(["admin", "consultorEmpresa"]), getCompany);
router.put(
  "/:id",
  requireRole(["admin", "consultorEmpresa"]),
  requireSameCompany,
  updateCompany
);

export default router;
