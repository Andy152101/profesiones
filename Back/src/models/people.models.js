// Importa mongoose para definir el esquema y modelo de personas
import mongoose from "mongoose";
// Define el esquema de persona con sus campos y validaciones
const peopleSchema = new mongoose.Schema(
  {
    //nombres y apellidos de la persona
    names: {
      type: String,
      required: true,
    },
    //documento de la persona
    doctype: {
      type: String,
      required: true,
    },
    //numero de documento de la persona
    docnumber: {
      type: String,
      required: true,
      unique: true,
    },
    //fecha de nacimiento de la persona
    birthdate: {
      type: String,
      required: true,
    },
    // Sexo de la persona
    sex: {
      type: String,
      required: true,
    },
    //telefono de la persona
    phone: {
      type: String,
      required: true,
    },
    //correo de la persona
    email: {
      type: String,
      required: true,
      unique: true,
    },
    //empresa donde trabaja la persona (referencia a Company)
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    //tiempo de trabajo en la empresa
    companytime: {
      type: String,
      required: true,
    },
    //nivel academico de la persona
    academiclevel: {
      type: String,
      required: true,
    },
    //fecha de graduacion de la persona
    graduationdate: {
      type: String,
      required: true,
    },
    //mano derecha o izquierda
    dominanthand: {
      type: String,
      required: true,
    },
    //direccion de la persona
    address: {
      type: String,
      required: true,
    },
    //barrio de residencia de la persona
    neighborhood: {
      type: String,
      required: true,
    },
    //municipio de residencia de la persona
    municipality: {
      type: String,
      required: true,
    },
  },
  {
    //agregar el tiempo de creacion y modificacion
    timestamps: true,
  }
);

//exportar el modelo para poder usarlo en otros archivos
export default mongoose.model("People", peopleSchema);
