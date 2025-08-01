//importa mongoose para crear un esquema de datos para el modelo task con 3 campos: title, description y date
import mongoose from "mongoose";

//definimos el esquema de datos para el modelo task con 3 campos: title, description y date  y sus validaciones
//el campo title y description son requeridos y el campo date tiene un valor por defecto
const taskSchema = new mongoose.Schema(
  {
    // titulo de la tarea,es un string y es requerido
    title: {
      type: String,
      Required: true,
    },
    // descripcion de la tarea,es un string y es requerido
    description: {
      type: String,
      Required: true,
    },
    // fecha de la tarea,es un objeto de tipo Date y tiene un valor por defecto
    date: {
      type: Date,
      default: Date.now,
    },
    // usuario que crea la tarea,es un objeto de tipo ObjectId y tiene un valor por defecto
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    // indica que el modelo debe tener timestamps
    timestamps: true,
  }
);

// exporta el modelo task con el esquema definido para usarlo en otros archivos
export default mongoose.model("Task", taskSchema);
