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
      index: true, // Índice para optimizar búsquedas
    },
    // Contraseña, requerida
    password: {
      type: String,
      required: true,
    },
    // Rol actualizado con nuevos valores
    role: {
      type: String,
      enum: ["admin", "consultorEmpresa", "empleado"], // Nuevos roles según la propuesta
      default: "empleado", // Rol por defecto para nuevos registros
    },
    // Referencia a la empresa (para consultor-empresa y empleado)
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: function () {
        return this.role === "consultorEmpresa" || this.role === "empleado";
      },
      index: true, // Índice para optimizar búsquedas por empresa
    },
    // Indica si el usuario ha cambiado su contraseña por defecto
    defaultPasswordSet: {
      type: Boolean,
      default: false,
    },
    // Referencia al empleado en la colección People (solo para empleados)
    peopleRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
      required: function () {
        return this.role === "empleado";
      },
    },
  },
  {
    //agrega campos de creación y actualización
    timestamps: true,
  }
);

// Middleware pre-save para validaciones adicionales
UserSchema.pre("save", function (next) {
  // Validar que admin no tenga companyRef
  if (this.role === "admin" && this.companyRef) {
    const error = new Error(
      "Los administradores no pueden tener una empresa asociada"
    );
    return next(error);
  }

  // Validar que consultor-empresa y empleado tengan companyRef
  if (
    (this.role === "consultorEmpresa" || this.role === "empleado") &&
    !this.companyRef
  ) {
    const error = new Error(
      "Los consultores de empresa y empleados deben tener una empresa asociada"
    );
    return next(error);
  }

  next();
});

// Método para verificar si el usuario necesita cambiar contraseña
UserSchema.methods.needsPasswordChange = function () {
  return this.role === "empleado" && !this.defaultPasswordSet;
};

// Método para obtener permisos según el rol
UserSchema.methods.getPermissions = function () {
  const permissions = {
    admin: {
      canViewAllTests: true,
      canViewAllEmployees: true,
      canManageCompanies: true,
      canViewObservations: true,
      canManageUsers: true,
    },
    consultorEmpresa: {
      canViewAllTests: false,
      canViewCompanyTests: true,
      canViewCompanyEmployees: true,
      canManageCompanies: false,
      canViewObservations: true,
      canManageUsers: false,
    },
    empleado: {
      canViewAllTests: false,
      canViewOwnTests: true,
      canViewCompanyEmployees: false,
      canManageCompanies: false,
      canViewObservations: false,
      canManageUsers: false,
    },
  };

  return permissions[this.role] || permissions.empleado;
};

//exporta el modelo de usuario
export default mongoose.model("User", UserSchema);
