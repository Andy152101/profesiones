// Importa el modelo de empresa y usuario
import Company from "../models/company.model.js";
import User from "../models/user.model.js";

// Solicitar registro de empresa
// 1. Extrae los datos del cuerpo de la petición
// 2. Verifica si la empresa ya existe por nombre o email
// 3. Si existe, responde con error 400
// 4. Si no existe, crea la solicitud de empresa
// 5. Guarda la empresa con estado no validado
// 6. Devuelve confirmación de solicitud enviada
export const requestCompanyRegistration = async (req, res) => {
  const { name, description, contactEmail, contactPhone, address } = req.body;

  try {
    // 2. Verificar si la empresa ya existe
    const existingCompany = await Company.findOne({
      $or: [{ name }, { contactEmail }],
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "Ya existe una empresa con ese nombre o email de contacto",
      });
    }

    // 4. Crear la solicitud de empresa
    const newCompany = new Company({
      name,
      description,
      contactEmail,
      contactPhone,
      address,
      companyAccessCode: await Company.generateUniqueAccessCode(),
      isValidated: false,
    });

    // 5. Guardar la empresa
    const companySaved = await newCompany.save();

    // 6. Respuesta de confirmación
    res.status(201).json({
      message:
        "Solicitud de registro enviada. Espere la aprobación del administrador.",
      companyRef: companySaved._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aprobar empresa (Solo Admin)
// 1. Obtiene el ID de la empresa de los parámetros
// 2. Busca la empresa en la base de datos
// 3. Si no existe, responde con error 404
// 4. Si ya está validada, responde con error 400
// 5. Actualiza el estado de validación y asigna el admin
// 6. Guarda los cambios y responde con la información actualizada
export const approveCompany = async (req, res) => {
  const { id } = req.params;

  try {
    // 2. Buscar la empresa
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // 4. Verificar si ya está validada
    if (company.isValidated) {
      return res.status(400).json({ message: "La empresa ya está aprobada" });
    }

    // 5. Actualizar estado de validación
    company.isValidated = true;
    company.adminRef = req.user.id;

    // 6. Guardar cambios
    const updatedCompany = await company.save();

    res.json({
      message: "Empresa aprobada exitosamente",
      company: {
        id: updatedCompany._id,
        name: updatedCompany.name,
        companyAccessCode: updatedCompany.companyAccessCode,
        isValidated: updatedCompany.isValidated,
        contactEmail: updatedCompany.contactEmail,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar empresas pendientes (Solo Admin)
// 1. Busca todas las empresas no validadas
// 2. Responde con la lista de empresas pendientes
export const getPendingCompanies = async (req, res) => {
  try {
    const pendingCompanies = await Company.find({ isValidated: false })
      .select("-companyAccessCode") // No mostrar el código hasta que sea aprobada
      .sort({ createdAt: -1 });

    res.json(pendingCompanies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar todas las empresas (Solo Admin)
// 1. Busca todas las empresas
// 2. Incluye información del admin que las aprobó
// 3. Responde con la lista completa
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isValidated: true })
      .populate("adminRef", "username email")
      .sort({ createdAt: -1 });

    res.json(companies);
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
    let query = { _id: id };

    // 2-4. Verificar permisos según el rol
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
  const { name, description, contactEmail, contactPhone, address } = req.body;

  try {
    // 2. Verificar permisos
    if (req.user.role === "consultorEmpresa") {
      if (req.user.companyRef.toString() !== id) {
        return res
          .status(403)
          .json({ message: "Solo puede actualizar su propia empresa" });
      }
    } else if (req.user.role === "empleado") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // 3. Buscar y actualizar
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // Actualizar campos si se proporcionan
    if (name) company.name = name;
    if (description !== undefined) company.description = description;
    if (contactEmail) company.contactEmail = contactEmail;
    if (contactPhone !== undefined) company.contactPhone = contactPhone;
    if (address !== undefined) company.address = address;

    const updatedCompany = await company.save();

    res.json({
      message: "Empresa actualizada exitosamente",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    }

    // 4. Eliminar empresa
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
    });

    // Empleados y consultores por empresa
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
  const { name, description, contactEmail, contactPhone, address } = req.body;

  try {
    // 1. Verificar si ya existe empresa por nombre o email
    const existingCompany = await Company.findOne({
      $or: [{ name }, { contactEmail }],
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "Ya existe una empresa con ese nombre o email de contacto",
      });
    }

    // 2. Crear empresa ya validada
    const newCompany = new Company({
      name,
      description,
      contactEmail,
      contactPhone,
      address,
      companyAccessCode: await Company.generateUniqueAccessCode(),
      isValidated: true, // ya queda activa
      adminRef: req.user.id, // admin que la registra
    });

    // 3. Guardar empresa
    const companySaved = await newCompany.save();

    // 4. Responder
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
