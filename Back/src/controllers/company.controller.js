// Importa el modelo de empresa y usuario

import Company from "../models/company.model.js";

import User from "../models/user.model.js";

// Listar todas las empresas (Solo Admin)

// 1. Busca todas las empresas

// 2. Incluye información del admin que las aprobó

// 3. Responde con la lista completa

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isValidated: true })
      .populate("adminRef", "username email")
      .sort({ createdAt: -1 })
      .lean(); // devuelve objetos JS planos, no instancias de mongoose

    // Normalizar IDs
    const formatted = companies.map((c) => ({
      ...c,
      _id: c._id.toString(),
      adminRef: c.adminRef
        ? {
            ...c.adminRef,
            _id: c.adminRef._id.toString(),
          }
        : null,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener información de empresa específica

// 1. Obtiene el ID de la empresa de los parámetros

// 2. Verifica permisos según el rol del usuario

// 3. Admin: puede ver cualquier empresa

// 4. Consultor-empresa: solo puede ver su propia empresa

// 5. Responde con la información de la empresa

export const getCompany = async (req, res) => {
  const { id } = req.params;

  try {
    let query = { _id: id }; // 2-4. Verificar permisos según el rol

    if (req.user.role === "consultorEmpresa") {
      // Solo puede ver su propia empresa

      if (req.user.companyRef.toString() !== id) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
    } else if (req.user.role === "empleado") {
      // Los empleados no pueden acceder a este endpoint

      return res.status(403).json({ message: "Acceso denegado" });
    }

    const company = await Company.findOne(query).populate(
      "adminRef",

      "username email"
    );

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar empresa

// 1. Obtiene el ID de la empresa y los datos a actualizar

// 2. Verifica permisos (solo admin o consultor de la empresa)

// 3. Busca y actualiza la empresa

// 4. Responde con la empresa actualizada

export const updateCompany = async (req, res) => {
  const { id } = req.params;

  const {
    name,

    description,

    contactEmail,

    contactPhone,

    address,

    headquarters,
  } = req.body;

  try {
    // 🔒 1. Verificar permisos

    if (req.user.role === "consultorEmpresa") {
      if (req.user.companyRef.toString() !== id) {
        return res

          .status(403)

          .json({ message: "Solo puede actualizar su propia empresa" });
      }
    } else if (req.user.role === "empleado") {
      return res.status(403).json({ message: "Acceso denegado" });
    } // 🔍 2. Buscar empresa

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    } // 🛑 3. Validar duplicado en `name` y `headquarters` (si los están cambiando)

    if (
      (name && name !== company.name) ||
      (headquarters && headquarters !== company.headquarters)
    ) {
      const existing = await Company.findOne({
        name: name || company.name,

        headquarters: headquarters || company.headquarters,

        _id: { $ne: id },
      });

      if (existing) {
        return res

          .status(400)

          .json({
            message: "Ya existe una empresa con este mismo nombre y sede",
          });
      }
    } // ✍️ 4. Actualizar campos si se proporcionan

    if (name) company.name = name;

    if (description !== undefined) company.description = description;

    if (contactEmail) company.contactEmail = contactEmail;

    if (contactPhone !== undefined) company.contactPhone = contactPhone;

    if (address !== undefined) company.address = address;

    if (headquarters !== undefined) company.headquarters = headquarters; // 💾 5. Guardar

    const updatedCompany = await company.save();

    return res.json({
      message: "Empresa actualizada exitosamente",

      company: updatedCompany,
    });
  } catch (error) {
    // 🎯 Manejo específico de error por índice duplicado

    if (error.code === 11000) {
      return res

        .status(400)

        .json({
          message: "El nombre de la empresa o el email de contacto ya existe",
        });
    }

    console.error("Error en updateCompany:", error);

    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

// Eliminar empresa (Solo Admin)

// 1. Obtiene el ID de la empresa

// 2. Verifica que no tenga usuarios asociados

// 3. Si tiene usuarios, responde con error

// 4. Si no tiene usuarios, elimina la empresa

export const deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    // 2. Verificar usuarios asociados

    const associatedUsers = await User.countDocuments({ companyRef: id });

    if (associatedUsers > 0) {
      return res.status(400).json({
        message: `No se puede eliminar la empresa. Tiene ${associatedUsers} usuario(s) asociado(s)`,
      });
    } // 4. Eliminar empresa

    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    res.json({ message: "Empresa eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener estadísticas de empresa (Solo Admin)

// 1. Cuenta empresas por estado

// 2. Obtiene estadísticas generales

// 3. Responde con el resumen

// GET /company-stats

export const getCompanyStats = async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments();

    const totalEmployees = await User.countDocuments({
      role: { $in: ["empleado", "consultorEmpresa"] },
    }); // Empleados y consultores por empresa

    const usersByCompany = await User.aggregate([
      {
        $match: { role: { $in: ["empleado", "consultorEmpresa"] } },
      },

      {
        $group: {
          _id: { companyRef: "$companyRef", role: "$role" },

          userCount: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "companies",

          localField: "_id.companyRef",

          foreignField: "_id",

          as: "company",
        },
      },

      { $unwind: "$company" },

      {
        $project: {
          companyName: "$company.name",

          role: "$_id.role",

          userCount: 1,
        },
      },

      { $sort: { companyName: 1, role: 1 } },
    ]);

    res.json({
      totalCompanies,

      totalEmployees,

      usersByCompany, // aquí tienes role, companyName y userCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear empresa directamente (Solo Admin)

export const createCompany = async (req, res) => {
  const {
    name,

    description,

    contactEmail,

    contactPhone,

    address,

    headquarters,
  } = req.body;

  try {
    // 1. Verificar si ya existe una empresa con el mismo nombre y sede o el mismo email de contacto

    const existingCompany = await Company.findOne({
      $or: [{ name, headquarters }, { contactEmail }],
    });

    if (existingCompany) {
      return res.status(400).json({
        message:
          "Ya existe una empresa con el mismo nombre y sede, o con ese email de contacto",
      });
    } // 2. Crear empresa ya validada

    const newCompany = new Company({
      name,

      description,

      contactEmail,

      contactPhone,

      address,

      headquarters,

      companyAccessCode: await Company.generateUniqueAccessCode(),

      isValidated: true, // ya queda activa

      adminRef: req.user.id, // admin que la registra
    }); // 3. Guardar empresa

    const companySaved = await newCompany.save(); // 4. Responder

    res.status(201).json({
      message: "Empresa creada exitosamente",

      company: {
        id: companySaved._id,

        name: companySaved.name,

        contactEmail: companySaved.contactEmail,

        companyAccessCode: companySaved.companyAccessCode,

        isValidated: companySaved.isValidated,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
