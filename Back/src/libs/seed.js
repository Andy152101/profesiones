import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Professions from "../models/professions.model.js";
import { connectDB } from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedProfessions = async () => {
  try {
    await connectDB();

    const professionsFilePath = path.join(__dirname, "../../professions.json");
    const professionsData = JSON.parse(fs.readFileSync(professionsFilePath, "utf-8"));

    await Professions.deleteMany({});
    console.log("Colección de profesiones limpiada.");

    await Professions.insertMany(professionsData);
    console.log("Nuevas profesiones insertadas.");

    console.log("¡Seed completado con éxito!");
  } catch (error) {
    console.error("Error durante el seeding:", error);
  } finally {
    mongoose.disconnect();
    console.log("Desconectado de la base de datos.");
  }
};

seedProfessions();
