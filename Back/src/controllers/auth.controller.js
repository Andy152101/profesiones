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
// 1. Extrae los datos del cuerpo de la petición.
// 2. Verifica si el email ya está registrado.
// 3. Si existe, responde con error 400.
// 4. Si no existe, hashea la contraseña y crea el usuario.
// 5. Guarda el usuario y genera un token de acceso.
// 6. Devuelve los datos del usuario y el token en una cookie.
// 7. Si ocurre un error, responde con 500 y mensaje de error.
export const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // 2. Verifica si el email ya está registrado
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["Usuario Existente"]);
    // 4. Hashea la contraseña y crea el usuario
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role, // Agregar el rol aquí
    });
    // 5. Guarda el usuario y genera el token
    const userSaved = await newUser.save();
    const token = await createAccessToken({
      id: userSaved._id,
      role: userSaved.role,
      companyRef: userSaved.companyRef || null, //  importante
    });

    // 6. Devuelve los datos y el token en cookie
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
    // 7. Manejo de errores
    res.status(500).json({ message: error.message });
  }
};

// Registra un empleado usando código de acceso de empresa
// 1. Extrae los datos del empleado y código de acceso
// 2. Valida el código de acceso de la empresa
// 3. Verifica si el email ya está registrado
// 4. Crea el registro en People
// 5. Crea el usuario asociado con contraseña temporal
// 6. Responde con los datos del usuario y contraseña temporal
export const registerEmployee = async (req, res) => {
  const { username, email, companyAccessCode, peopleData, createdByAdmin } =
    req.body;

  try {
    // 2. Validar código de acceso de empresa
    console.log(
      "Valor recibido en companyAccessCode:",
      `"${companyAccessCode}"`,
      "Longitud:",
      companyAccessCode.length
    );
    console.log("Body completo recibido:", req.body);

    const company = await Company.findOne({
      companyAccessCode,
      isValidated: true,
    });

    if (!company) {
      return res.status(400).json({
        message: "Código de acceso inválido o empresa no aprobada",
      });
    }

    // 3. Verificar si el email ya está registrado
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Verificar si el documento ya existe
    const peopleFound = await People.findOne({
      docnumber: peopleData.docnumber,
    });
    if (peopleFound) {
      return res
        .status(400)
        .json({ message: "El número de documento ya está registrado" });
    }

    // 4. Crear registro en People
    const newPeople = new People({
      ...peopleData,
      company: company.name, // Asegurar que el nombre de la empresa sea correcto
    });

    const peopleSaved = await newPeople.save();

    // 5. Usar la contraseña ingresada por el empleado
    if (!req.body.password) {
      return res.status(400).json({ message: "La contraseña es requerida" });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    // Crear usuario asociado
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: "empleado",
      companyRef: company._id,
      peopleRef: peopleSaved._id,
      defaultPasswordSet: false,
    });

    const userSaved = await newUser.save();

    // 6. Responder con datos del usuario
    res.status(201).json({
      message: "Empleado registrado exitosamente",
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
    res.status(500).json({ message: error.message });
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
// 1. Extrae los datos del consultor y ID de empresa
// 2. Verifica que la empresa exista y esté validada
// 3. Verifica si el email ya está registrado
// 4. Crea el usuario consultor
// 5. Responde con los datos del usuario
export const registerConsultant = async (req, res) => {
  const { username, email, password, companyRef } = req.body;
  if (!companyRef) {
    return res.status(400).json({ message: "companyRef es requerido" });
  }
  try {
    // 2. Verificar empresa
    const company = await Company.findOne({
      _id: companyRef,
      isValidated: true,
    });

    if (!company) {
      return res.status(400).json({
        message: "Empresa no encontrada o no aprobada",
      });
    }

    // 3. Verificar email
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // 4. Crear usuario consultor
    const password = req.body.password || "123456";
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: "consultorEmpresa",
      companyRef: company._id,
      defaultPasswordSet: true, // Los consultores no necesitan cambiar contraseña
    });

    const userSaved = await newUser.save();

    // 5. Responder
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
    console.error("Error en registerConsultant:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cambiar contraseña por defecto (Empleados)
// 1. Verifica la contraseña actual
// 2. Valida que el usuario necesite cambiar contraseña
// 3. Actualiza la contraseña y marca como cambiada
// 4. Responde con confirmación
export const changeDefaultPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 2. Validar que necesite cambiar contraseña
    if (user.defaultPasswordSet) {
      return res.status(400).json({
        message: "La contraseña ya ha sido cambiada anteriormente",
      });
    }

    // 1. Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    // 3. Actualizar contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    user.defaultPasswordSet = true;

    await user.save();

    // 4. Responder
    res.json({
      message: "Contraseña actualizada exitosamente",
      defaultPasswordSet: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Inicia sesión de usuario.
// 1. Extrae email y password del cuerpo de la petición.
// 2. Busca el usuario por email.
// 3. Si no existe, responde con error 400.
// 4. Compara la contraseña recibida con la almacenada.
// 5. Si no coincide, responde con error 400.
// 6. Si coincide, genera un token de acceso y lo envía en una cookie.
// 7. Devuelve los datos del usuario autenticado.
// 8. Si ocurre un error, responde con 500 y mensaje de error.
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 2. Busca el usuario por email
    const userFound = await User.findOne({ email })
      .populate("companyRef", "name companyAccessCode isValidated")
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
    // 8. Manejo de errores
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cierra sesión de usuario.
// 1. Elimina la cookie de token.
// 2. Devuelve un código 200.
// 3. Si ocurre un error, responde con 500 y mensaje de error.
export const logout = (req, res) => {
  res.cookie("token", " ", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

//Obtiene el perfil del usuario autenticado.
// 1. Obtiene el ID del usuario autenticado desde la cookie.
// 2. Busca el usuario en la base de datos.
// 3. Si no existe, responde con error 400.
// 4. Si existe, devuelve los datos del usuario.
export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id)
    .populate("companyRef", "name companyAccessCode")
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
// 1. Verifica si hay un token en las cookies.
// 2. Si no hay token, responde con error 401.
// 3. Si hay token, verifica el token.
// 4. Si el token es válido, devuelve los datos del usuario.
// 5. Si el token es inválido, responde con error 401.
// 6. Si ocurre un error, responde con 500 y mensaje de error.
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "unauthorized" });
    const userFound = await User.findById(user.id)
      .populate("companyRef", "name companyAccessCode")
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
// 1. Obtiene todos los usuarios de la base de datos.
// 2. Filtra según el rol del usuario que hace la petición.
// 3. Admin: ve todos los usuarios
// 4. Consultor-empresa: ve solo usuarios de su empresa
// 5. Empleado: no tiene acceso
export const getAllRegisters = async (req, res) => {
  try {
    console.log("👤 req.user:", req.user); // <-- debug token

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
      .populate("companyRef", "name")
      .populate("peopleRef", "names docnumber");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un Usuario por ID
// 1. Obtiene el ID del usuario de los parámetros de la URL.
// 2. Verifica permisos de acceso según el rol.
// 3. Busca el usuario en la base de datos.
// 4. Si no encuentra el usuario, responde con 404.
// 5. Si encuentra el usuario, responde con 200 y usuario.
// 📌 Obtener un registro por ID
export const viewRegister = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // 2. Buscar el usuario en la BD (sin password)
    const user = await User.findById(id)
      .select("-password")
      .populate("companyRef", "name")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 3. Validar permisos
    if (req.user.role === "empleado" && req.user.id !== id) {
      // ❌ Empleado solo puede ver su propio perfil
      return res.status(403).json({ message: "Acceso denegado" });
    }

    if (
      req.user.role === "consultorEmpresa" &&
      user.companyRef &&
      user.companyRef._id.toString() !== req.user.companyRef.toString()
    ) {
      // ❌ Consultor solo puede ver usuarios de su empresa
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // 4. Preparar respuesta uniforme
    const formattedUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      company: user.companyRef
        ? { id: user.companyRef._id, name: user.companyRef.name }
        : null,
      needsPasswordChange: user.needsPasswordChange,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // 5. Devolver resultado
    res.json(formattedUser);
  } catch (error) {
    console.error("❌ Error en viewRegister:", error);
    res.status(500).json({ message: "Error al obtener el registro" });
  }
};

// Actualizar un Usuario por ID
// 1. Obtiene el ID del usuario de los parámetros de la URL.
// 2. Verifica permisos según el rol.
// 3. Busca el usuario en la base de datos.
// 4. Actualiza los campos permitidos según el rol.
// 5. Guarda el usuario y responde con los datos actualizados.

export const updateRegisters = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, companyRef } = req.body;

  try {
    // 1️⃣ Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // 2️⃣ Buscar el usuario a actualizar
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 3️⃣ Permisos básicos: empleado solo puede actualizar su perfil
    if (req.user.role === "empleado" && req.user.id !== id) {
      return res
        .status(403)
        .json({ message: "Solo puede actualizar su propio perfil" });
    }

    // 4️⃣ Consultor solo puede actualizar usuarios de su empresa
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

    // 5️⃣ Actualizar campos editables
    if (username) user.username = username;
    if (email) user.email = email;

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

    // 6️⃣ Solo admin puede cambiar roles
    if (role && req.user.role === "admin") {
      if (req.user.id === id && role !== "admin") {
        return res.status(400).json({
          message: "No puedes quitarte a ti mismo el rol de administrador",
        });
      }
      user.role = role;
    }

    // 7️⃣ Actualizar companyRef si aplica y no es admin
    if (companyRef && req.user.role !== "admin") {
      user.companyRef = companyRef;
    }

    // 8️⃣ Guardar cambios y capturar errores de validación de Mongoose
    try {
      const updatedUser = await user.save();
      return res.json({
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        companyRef: updatedUser.companyRef,
        defaultPasswordSet: updatedUser.defaultPasswordSet,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });
    } catch (mongooseError) {
      // Validaciones de esquema fallidas
      return res.status(400).json({
        message: "Error de validación al actualizar usuario",
        errors: mongooseError.errors || mongooseError.message,
      });
    }
  } catch (error) {
    console.error("Error en updateRegisters:", error);
    return res.status(500).json({
      message: "Error interno al actualizar usuario",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Eliminar un Usuario
// 1. Obtiene el ID del usuario de los parámetros de la URL.
// 2. Verifica permisos (solo admin).
// 3. Busca el usuario en la base de datos.
// 4. Si es empleado, también elimina el registro de People.
// 5. Elimina el usuario y responde con confirmación.
export const deleteRegisters = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 4. Si es empleado, eliminar también el registro de People
    if (user.role === "empleado" && user.peopleRef) {
      await People.findByIdAndDelete(user.peopleRef);
    }

    // 5. Eliminar usuario
    await User.findByIdAndDelete(id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
