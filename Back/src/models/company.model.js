// Importa mongoose para definir el esquema y modelo de empresa
import mongoose from "mongoose";

// Define el esquema de empresa con sus campos y validaciones
const CompanySchema = new mongoose.Schema(
  {
    // Nombre de la empresa
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    // Código de acceso único para la empresa
    companyAccessCode: {
      type: String,
      required: true,
      unique: true,
      index: true, // Índice para optimizar búsquedas
    },
    // Indica si la empresa ha sido validada por un administrador
    isValidated: {
      type: Boolean,
      default: false,
    },
    // Referencia al usuario administrador que aprobó la empresa
    adminRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Opcional hasta que sea aprobada
    },
    // Información adicional de la empresa
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Información de contacto
    contactEmail: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: "",
    },
    // Dirección de la empresa
    address: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    // Agregar campos de creación y actualización
    timestamps: true,
  }
);

// Método estático para generar código de acceso único
CompanySchema.statics.generateAccessCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Método estático para generar código único verificando que no exista
CompanySchema.statics.generateUniqueAccessCode = async function() {
  let code;
  let exists = true;
  
  while (exists) {
    code = this.generateAccessCode();
    const existingCompany = await this.findOne({ companyAccessCode: code });
    exists = !!existingCompany;
  }
  
  return code;
};

// Exporta el modelo de empresa
export default mongoose.model("Company", CompanySchema);

