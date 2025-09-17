//importa mongoose para definir el esquema y modelo de pruebas/tests
import mongoose from "mongoose";

// Define el esquema de test con todos los campos posibles de las pruebas realizadas
const testsSchema = new mongoose.Schema(
  {
    // Referencia a la persona (usuario) que realizó el test
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
    },
    //fecha del test
    date: {
      type: String,
      required: true,
    },
    // número de documento
    docnumber: {
      type: String,
      default: "",
    },
    //nombres de la persona
    names: {
      type: String,
      default: "",
    },
    // Empresa donde trabaja
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    // mano dominante
    dominanthand: {
      type: String,
      default: "",
    },
    // Tiempos y escalas de pruebas de colocación, rotación y desplazamiento de minas
    mineplacementtime1: {
      type: Number,
      default: 0,
    },
    mineplacementtime2: {
      type: Number,
      default: 0,
    },
    mineplacementtotal: {
      type: Number,
      default: 0,
    },
    mineplacementscale: {
      type: String,
      default: "",
    },
    minerotationtime1: {
      type: Number,
      default: 0,
    },
    minerotationtime2: {
      type: Number,
      default: 0,
    },
    minerotationtotal: {
      type: Number,
      default: 0,
    },
    minerotationscale: {
      type: String,
      default: "",
    },
    minedisplacementtime1: {
      type: Number,
      default: 0,
    },
    minedisplacementtime2: {
      type: Number,
      default: 0,
    },
    minedisplacementtotal: {
      type: Number,
      default: 0,
    },
    minedisplacementscale: {
      type: String,
      default: "",
    },
    mineobservations: {
      type: String,
      default: "",
    },
    // Pruebas de purde (mano dominante, no dominante, ambas, ensamblaje)
    purdedominanthand: {
      type: Number,
      default: 0,
    },
    purdedominanthandscale: {
      type: String,
      default: "",
    },
    purdenodominanthand: {
      type: Number,
      default: 0,
    },
    purdenodominanthandscale: {
      type: String,
      default: "",
    },
    purdebothhands: {
      type: Number,
      default: 0,
    },
    purdebothhandsscale: {
      type: String,
      default: "",
    },
    purdeassemble: {
      type: Number,
      default: 0,
    },
    purdeassemblescale: {
      type: String,
      default: "",
    },
    purdeobservations: {
      type: String,
      default: "",
    },
    // Pruebas de actividad J
    activityjtest: {
      type: Number,
      default: 0,
    },
    activityjtestscale: {
      type: String,
      default: "",
    },
    activityjtestobservations: {
      type: String,
      default: "",
    },
    // Pruebas de reacción
    reaction1: {
      type: Number,
      default: 0,
    },
    reaction1scale: {
      type: String,
      default: "",
    },
    reaction2: {
      type: Number,
      default: 0,
    },
    reaction2scale: {
      type: String,
      default: "",
    },
    reactionobservations: {
      type: String,
      default: "",
    },
    // Pruebas de dedos
    fingers: {
      type: Number,
      default: 0,
    },
    fingersscale: {
      type: String,
      default: "",
    },
    fingersobservations: {
      type: String,
      default: "",
    },
    // Pruebas de visión de colores (Ishihara)
    ishinormalvision: {
      type: Number,
      default: 0,
    },
    ishideuteranopia: {
      type: Number,
      default: 0,
    },
    ishiportanopia: {
      type: Number,
      default: 0,
    },
    ishidaltonism: {
      type: Number,
      default: 0,
    },
    ishiobservations: {
      type: String,
      default: "",
    },
    // Pruebas de estrella
    startime: {
      type: Number,
      default: 0,
    },
    starTimeOne: {
      type: String,
      default: "",
    },
    startoucherrors: {
      type: Number,
      default: 0,
    },
    starTouchErrorsOne: {
      type: String,
      default: "",
    },
    // Pruebas de juego de alambre
    wireGameTime: {
      type: Number,
      default: 0,
    },
    wireGameError: {
      type: Number,
      default: 0,
    },
    wireGameLevel: {
      type: String,
      default: "",
    },
    // Pruebas de agudeza visual
    visualAcuity: {
      type: String,
      default: "",
    },
    visualAcuityLevel: {
      type: String,
      default: "",
    },
  },
  {
    //no agrega la fecha de creación y modificación
    timestamps: false,
  }
);

//exporta el modelo de pruebas
export default mongoose.model("Tests", testsSchema);
