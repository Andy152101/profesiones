// Importa el modelo de usuario y librerías necesarias para autenticación y manejo de tokens
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import People from "../models/people.models.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import mongoose from "mongoose";

// Registra un nuevo usuario en la base de datos.
export const register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Verificar si el email ya está registrado
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["Usuario Existente"]);
    // Hashea la contraseña y crea el usuario
    const passwordHash = await bcrypt.hash(password, 10);
    // Autogenerar username (ejemplo: email antes del @)
    const generatedUsername = email.split("@")[0] + "_" + Date.now();

    const newUser = new User({
      username: generatedUsername,
      email,
      password: passwordHash,
      role,
    });

    // Guarda el usuario y genera el token
    const userSaved = await newUser.save();
    const token = await createAccessToken({
      id: userSaved._id,
      role: userSaved.role,
      companyRef: userSaved.companyRef || null,
    });

    // Devuelve los datos y el token en cookie
    res.cookie("token", token);
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      role: userSaved.role,
      companyRef: userSaved.companyRef || null,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    // ⚠️ Mejorado: Manejo específico del error de clave duplicada
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado." });
    }
    // Manejo genérico para otros errores del servidor
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Registra un empleado usando código de acceso de empresa
export const registerEmployee = async (req, res) => {
  const { email, companyAccessCode, companyRef, peopleData, password } =
    req.body;

  try {
    let company;
    // 🔹 Si el que crea es admin → usa companyRef
    if (req.user?.role === "admin" && companyRef) {
      company = await Company.findOne({ _id: companyRef, isValidated: true });
    }
    // 🔹 Si es auto-registro (empleado) → usa companyAccessCode
    else if (companyAccessCode) {
      company = await Company.findOne({
        companyAccessCode,
        isValidated: true,
      });
    }

    if (!company) {
      return res.status(400).json({
        message: "Empresa inválida o no aprobada",
      });
    }

    // 1️⃣ Verificar si el email ya está registrado
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // 2️⃣ Verificar si el documento ya existe en People
    const peopleFound = await People.findOne({
      docnumber: peopleData.docnumber,
    });
    if (peopleFound) {
      return res
        .status(400)
        .json({ message: "El número de documento ya está registrado" });
    }

    // 3️⃣ Crear registro en People
    const newPeople = new People({
      ...peopleData,
      company: company._id,
    });
    const peopleSaved = await newPeople.save();

    // 4️⃣ Manejar contraseña
    let finalPassword;
    if (req.user?.role === "admin") {
      // 🔹 Si es admin → contraseña por defecto
      finalPassword = "123456";
    } else {
      // 🔹 Si es empleado → debe enviar contraseña
      if (!password) {
        return res.status(400).json({ message: "La contraseña es requerida" });
      }
      finalPassword = password;
    }
    const passwordHash = await bcrypt.hash(finalPassword, 10);

    // 5️⃣ Generar username basado en doc o email
    const generatedUsername = peopleSaved.names
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    // 6️⃣ Crear usuario asociado
    const newUser = new User({
      username: generatedUsername,
      email,
      password: passwordHash,
      role: "empleado",
      companyRef: company._id,
      peopleRef: peopleSaved._id,
      defaultPasswordSet: req.user?.role === "admin",
    });

    const userSaved = await newUser.save();

    // 7️⃣ Responder
    res.status(201).json({
      message: "Empleado registrado exitosamente",
      user: {
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
        role: userSaved.role,
        companyRef: {
          id: company._id,
          name: company.name,
        },
      },
      company: {
        name: company.name,
        id: company._id,
      },
    });
  } catch (error) {
    // ⚠️ Mejorado: Manejo específico del error de clave duplicada
    if (error.code === 11000) {
      return res.status(400).json({
        message: "El email o el número de documento ya están registrados.",
      });
    }
    console.error("❌ Error en registerEmployee:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Valida un código de acceso de empresa y valida si está activo
export const validateAccessCode = async (req, res) => {
  const { code } = req.body;

  try {
    const company = await Company.findOne({
      companyAccessCode: code,
      isValidated: true,
    });

    if (!company) {
      return res.json({ valid: false });
    }

    return res.json({ valid: true });
  } catch (error) {
    return res.status(500).json({ valid: false, message: "Error interno" });
  }
};

// Registra un consultor de empresa (Solo Admin)
export const registerConsultant = async (req, res) => {
  const { email, password, companyRef, username } = req.body;
  if (!companyRef) {
    return res.status(400).json({ message: "companyRef es requerido" });
  }
  try {
    // Verificar empresa
    const company = await Company.findOne({
      _id: companyRef,
      isValidated: true,
    });

    if (!company) {
      return res.status(400).json({
        message: "Empresa no encontrada o no aprobada",
      });
    }

    // Verificar email
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Crear usuario consultor
    const passwordToHash = password || "123456";
    const passwordHash = await bcrypt.hash(passwordToHash, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: "consultorEmpresa",
      companyRef: company._id,
      defaultPasswordSet: true,
    });

    const userSaved = await newUser.save();

    // Responder
    res.status(201).json({
      message: "Consultor registrado exitosamente",
      user: {
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
        role: userSaved.role,
        companyRef: userSaved.companyRef,
      },
      company: {
        name: company.name,
        id: company._id,
      },
    });
  } catch (error) {
    // ⚠️ Mejorado: Manejo específico del error de clave duplicada
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado." });
    }
    console.error("Error en registerConsultant:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Cambiar contraseña por defecto (Empleados)
export const changeDefaultPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar que necesite cambiar contraseña
    if (user.defaultPasswordSet) {
      return res.status(400).json({
        message: "La contraseña ya ha sido cambiada anteriormente",
      });
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña actual incorrecta" });

    // Actualizar contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    user.defaultPasswordSet = true;

    await user.save();

    // Responder
    res.json({
      message: "Contraseña actualizada exitosamente",
      defaultPasswordSet: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Inicia sesión de usuario.
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 2. Busca el usuario por email
    const userFound = await User.findOne({ email })
      .populate("companyRef", "name companyAccessCode isValidated headquarters")
      .populate("peopleRef");

    if (!userFound) return res.status(400).json({ message: "User not found" });

    // Verificar que la empresa esté validada (si aplica)
    if (userFound.companyRef && !userFound.companyRef.isValidated) {
      return res.status(400).json({
        message: "Su empresa aún no ha sido aprobada por un administrador",
      });
    }

    // 4. Compara la contraseña recibida con la almacenada
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // 6. Genera el token de acceso
    const tokenPayload = {
      id: userFound._id,
      role: userFound.role,
    };

    // Solo agregamos companyRef si el usuario NO es admin
    if (userFound.role !== "admin" && userFound.companyRef?._id) {
      tokenPayload.companyRef = userFound.companyRef._id;
    }

    const token = await createAccessToken(tokenPayload);
    console.log("✅ Token generado:", token);

    // 7. devuelve los datos y el token en una cookie
    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
      needsPasswordChange: userFound.needsPasswordChange(),
      company: userFound.companyRef
        ? {
            id: userFound.companyRef._id,
            name: userFound.companyRef.name,
            companyAccessCode: userFound.companyRef.companyAccessCode,
          }
        : null,
      people: userFound.peopleRef || null,
      permissions: userFound.getPermissions(),
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Cierra sesión de usuario.
export const logout = (req, res) => {
  res.cookie("token", " ", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

//Obtiene el perfil del usuario autenticado.
export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id)
    .populate("companyRef", "name companyAccessCode headquarters")
    .populate("peopleRef");

  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    role: userFound.role,
    needsPasswordChange: userFound.needsPasswordChange(),
    company: userFound.companyRef
      ? {
          id: userFound.companyRef._id,
          name: userFound.companyRef.name,
          companyAccessCode: userFound.companyRef.companyAccessCode,
        }
      : null,
    people: userFound.peopleRef || null,
    permissions: userFound.getPermissions(),
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

//Verifica el token de autenticación.
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "unauthorized" });
    const userFound = await User.findById(user.id)
      .populate("companyRef", "name companyAccessCode headquarters")
      .populate("peopleRef");

    if (!userFound)
      return res.status(401).json({
        message: "unauthorized",
      });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
      needsPasswordChange: userFound.needsPasswordChange(),
      company: userFound.companyRef
        ? {
            id: userFound.companyRef._id,
            name: userFound.companyRef.name,
          }
        : null,
      people: userFound.peopleRef || null,
      permissions: userFound.getPermissions(),
    });
  });
};

// Obtener Todos los Usuarios
export const getAllRegisters = async (req, res) => {
  try {
    console.log("👤 req.user:", req.user);

    let query = {};

    switch (req.user.role) {
      case "admin":
        // Admin ve todo
        break;

      case "consultorEmpresa":
        if (!req.user.companyRef) {
          return res
            .status(403)
            .json({ message: "Consultor sin empresa asignada" });
        }

        // Solo empleados de su empresa + él mismo
        query = {
          $or: [
            { companyRef: req.user.companyRef, role: "empleado" },
            { _id: req.user.id },
          ],
        };
        break;

      case "empleado":
        return res.status(403).json({ message: "Acceso denegado" });

      default:
        return res.status(403).json({ message: "Rol no válido" });
    }

    const users = await User.find(query)
      .select("-password")
      .populate("companyRef", "name headquarters")
      .populate("peopleRef", "names docnumber");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Obtener un Usuario por ID
export const viewRegister = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Traemos con populate
    const user = await User.findById(id)
      .select("-password")
      .populate("companyRef", "name companyAccessCode headquarters")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Armamos respuesta uniforme
    const formattedUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      company: user.companyRef
        ? {
            id: user.companyRef._id,
            name: user.companyRef.name,
            companyAccessCode: user.companyRef.companyAccessCode,
          }
        : { id: null, name: "Sin empresa" },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json(formattedUser);
  } catch (error) {
    console.error(" Error en viewRegister:", error);
    res.status(500).json({ message: "Error al obtener el registro" });
  }
};

// Actualizar un Usuario por ID
export const updateRegisters = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, companyRef } = req.body;

  try {
    // 1️⃣ Verificar autenticación
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // 2️⃣ Buscar usuario objetivo
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 3️⃣ Permisos según rol
    if (req.user.role === "empleado" && req.user.id !== id) {
      return res
        .status(403)
        .json({ message: "Solo puede actualizar su propio perfil" });
    }

    if (req.user.role === "consultorEmpresa") {
      const userHasCompany = user.companyRef
        ? user.companyRef.toString()
        : null;
      const editorHasCompany = req.user.companyRef
        ? req.user.companyRef.toString()
        : null;

      if (
        userHasCompany &&
        editorHasCompany &&
        userHasCompany !== editorHasCompany &&
        user._id.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
    }

    // ⚠️ Mejorado: Validar que companyRef exista y esté aprobada
    if (companyRef) {
      const company = await Company.findById(companyRef);
      if (!company || !company.isValidated) {
        return res.status(400).json({
          message: "La empresa asignada no existe o no ha sido aprobada.",
        });
      }

      if (req.user.role === "admin") {
        user.companyRef = companyRef;
      } else if (req.user.role === "consultorEmpresa") {
        if (req.user.companyRef?.toString() !== companyRef) {
          return res
            .status(403)
            .json({ message: "No puede reasignar usuarios a otra empresa" });
        }
        user.companyRef = companyRef;
      }
    }

    // 4️⃣ Actualizar campos básicos
    if (username) user.username = username;
    if (email) user.email = email;

    // 🔑 Manejo de contraseña
    if (password) {
      if (typeof password !== "string" || password.length < 6) {
        return res
          .status(400)
          .json({ message: "La contraseña debe tener al menos 6 caracteres" });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      user.password = passwordHash;
      if (user.role === "empleado") {
        user.defaultPasswordSet = true;
      }
    }

    // 👑 Rol: solo admin puede cambiar roles
    if (role && req.user.role === "admin") {
      if (req.user.id === id && role !== "admin") {
        return res.status(400).json({
          message: "No puedes quitarte a ti mismo el rol de administrador",
        });
      }
      user.role = role;
    }

    // 5️⃣ Guardar cambios
    const updatedUser = await user.save();

    // 6️⃣ Respuesta formateada
    return res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      company: updatedUser.companyRef
        ? {
            id: updatedUser.companyRef,
            name: (await Company.findById(updatedUser.companyRef))?.name,
          }
        : null,
      defaultPasswordSet: updatedUser.defaultPasswordSet,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    // ⚠️ Mejorado: Manejo específico de error de clave duplicada
    if (error.code === 11000) {
      return res.status(400).json({
        message: "El correo electrónico ya está en uso por otro usuario.",
      });
    }
    console.error("❌ Error en updateRegisters:", error);
    return res.status(500).json({
      message: "Error interno al actualizar usuario",
    });
  }
};

// Eliminar un Usuario
export const deleteRegisters = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si es empleado, eliminar también el registro de People
    if (user.role === "empleado" && user.peopleRef) {
      await People.findByIdAndDelete(user.peopleRef);
    }

    // Eliminar usuario
    await User.findByIdAndDelete(id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
