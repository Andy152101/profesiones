// Importa mongoose para definir el esquema y modelo de usuario
import mongoose from "mongoose";

// Define el esquema de usuario con sus campos y validaciones
const UserSchema = new mongoose.Schema(
  {
    // Nombre de usuario, requerido y sin espacios al inicio/final
    username: {
      type: String,
      required: true,
      trim: true,
    },
    // Correo electrónico, requerido y único sin espacios al inicio/final
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    // Contraseña, requerida
    password: {
      type: String,
      required: true,
    },
    // Rol, con valores predefinidos y por defecto 'user'
    role: {
      type: String,
      enum: ["admin", "user", "editor"], // Define los posibles roles
      default: "user", // Rol por defecto
    },
  },
  {
    //agrega campos de creación y actualización
    timestamps: true,
  }
);

//exporta el modelo de usuario
export default mongoose.model("User", UserSchema);
