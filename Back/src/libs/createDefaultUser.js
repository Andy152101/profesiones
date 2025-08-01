//importa el modelo de usuario y bcrypt para hashear contraseñas

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Crea un usuario administrador por defecto si no existe
// 1. Busca si ya existe un usuario con el email admin@test.com
// 2. Si existe, muestra mensaje y termina
// 3. Si no existe, hashea la contraseña y crea el usuario admin
// 4. Muestra mensaje de éxito o error
export async function createDefaultUser() {
  try {
    //1. Busca si ya existe un usuario con el email admin@test.com
    const userExists = await User.findOne({ email: "admin@test.com" });
    if (userExists) {
      // Si existe, muestra mensaje y termina
      console.log("Usuario por defecto ya existe");
      return;
    }
    //3. Si no existe, hashea la contraseña y crea el usuario admin
    // 3.1. Hashea la contraseña
    // 3.2. Crea el usuario admin
    // 3.3. Muestra mensaje de éxito o error
    // 3.4. Crea el usuario admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      username: "admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
    });
    //4. Muestra mensaje de éxito o error
    console.log(" Usuario admin@test.com creado con éxito");
  } catch (err) {
    console.error(" Error creando usuario por defecto:", err.message);
  }
}
