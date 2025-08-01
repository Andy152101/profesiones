// Importa el modelo de usuario y librerías necesarias para autenticación y manejo de tokens
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

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
    const token = await createAccessToken({ id: userSaved._id });
    // 6. Devuelve los datos y el token en cookie
    res.cookie("token", token);
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      role: userSaved.role, // Asegúrate de devolver el rol aquí
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    // 7. Manejo de errores
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
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });
    // 4. Compara la contraseña recibida con la almacenada
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });
    // 6. Genera el token de acceso
    const token = await createAccessToken({ id: userFound._id });
    // 7. devuelve los datos y el token en una cookie
    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
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
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    role: userFound.role,
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
    const userFound = await User.findById(user.id);
    if (!userFound)
      return res.status(401).json({
        message: "unauthorized",
      });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    });
  });
};
// Obtener Todos los Usuarios
// 1. Obtiene todos los usuarios de la base de datos.
// 2. Devuelve los usuarios en formato JSON.
// 3. Si ocurre un error, responde con 500 y mensaje de error.
// 4. Si no hay usuarios, responde con 404 y mensaje de
// usuario no encontrado.
// 5. Si hay usuarios, responde con 200 y usuarios.
// 6. Si hay un error, responde con 500 y mensaje de error.
export const getAllRegisters = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un Usuario por ID
// 1. Obtiene el ID del usuario de los parámetros de la URL.
// 2. Busca el usuario en la base de datos.
// 3. Si no encuentra el usuario, responde con 404 y mensaje de usuario no encontrado.
// 4. Si encuentra el usuario, responde con 200 y usuario.
// 5. Si ocurre un error, responde con 500 y mensaje de error.
// 6. Si hay un error, responde con 500 y mensaje de error.
export const viewRegister = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Actualizar un Usuario por ID
// 1. Obtiene el ID del usuario de los parámetros de la URL.
// 2. Busca el usuario en la base de datos.
// 3. Si no encuentra el usuario, responde con 404 y mensaje de usuario no encontrado.
// 4. Si encuentra el usuario, actualiza sus campos.
// 5. Guarda el usuario y responde con 200 y usuario.
// 6. Si ocurre un error, responde con 500 y mensaje de error.
// 7. Si hay un error, responde con 500 y mensaje de error.
export const updateRegisters = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body; // Desestructurar el rol

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar campos si se proporcionan
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      user.password = passwordHash;
    }
    if (role) user.role = role; // Actualizar el rol si se proporciona

    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role, // Incluir el rol en la respuesta
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un Usuario
// 1. Obtiene el ID del usuario de los parámetros de la URL.
// 2. Busca el usuario en la base de datos.
// 3. Si no encuentra el usuario, responde con 404 y mensaje de usuario no encontrado.
// 4. Si encuentra el usuario, lo elimina.
// 5. Responde con 200 y mensaje de usuario eliminado.
// 6. Si ocurre un error, responde con 500 y mensaje de error.
export const deleteRegisters = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
