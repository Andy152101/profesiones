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
      type: String,
      default: "",
    },
    mineplacementtime2: {
      type: String,
      default: "",
    },
    mineplacementtotal: {
      type: String,
      default: "",
    },
    mineplacementscale: {
      type: String,
      default: "",
    },
    minerotationtime1: {
      type: String,
      default: "",
    },
    minerotationtime2: {
      type: String,
      default: "",
    },
    minerotationtotal: {
      type: String,
      default: "",
    },
    minerotationscale: {
      type: String,
      default: "",
    },
    minedisplacementtime1: {
      type: String,
      default: "",
    },
    minedisplacementtime2: {
      type: String,
      default: "",
    },
    minedisplacementtotal: {
      type: String,
      default: "",
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
      type: String,
      default: "",
    },
    purdedominanthandscale: {
      type: String,
      default: "",
    },
    purdenodominanthand: {
      type: String,
      default: "",
    },
    purdenodominanthandscale: {
      type: String,
      default: "",
    },
    purdebothhands: {
      type: String,
      default: "",
    },
    purdebothhandsscale: {
      type: String,
      default: "",
    },
    purdeassemble: {
      type: String,
      default: "",
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
      type: String,
      default: "",
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
      type: String,
      default: "",
    },
    reaction1scale: {
      type: String,
      default: "",
    },
    reaction2: {
      type: String,
      default: "",
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
      type: String,
      default: "",
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
      type: String,
      default: "",
    },
    ishideuteranopia: {
      type: String,
      default: "",
    },
    ishiportanopia: {
      type: String,
      default: "",
    },
    ishidaltonism: {
      type: String,
      default: "",
    },
    ishiobservations: {
      type: String,
      default: "",
    },
    // Pruebas de estrella
    startime: {
      type: String,
      default: "",
    },
    starTimeOne: {
      type: String,
      default: "",
    },
    startoucherrors: {
      type: String,
      default: "",
    },
    starTouchErrorsOne: {
      type: String,
      default: "",
    },
    // Pruebas de juego de alambre
    wireGameTime: {
      type: String,
      default: "",
    },
    wireGameError: {
      type: String,
      default: "",
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
