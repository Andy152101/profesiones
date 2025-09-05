/**
 * @file db.js
 * @description Archivo de configuración para la conexión a la base de datos MongoDB.
 */
import mongoose from "mongoose";

/**
 * Función asíncrona para establecer la conexión con la base de datos MongoDB.
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    // Intenta conectar a la base de datos MongoDB en la URL especificada.
    // En este caso, se conecta a una instancia local de MongoDB llamada 'Escuela'.
    await mongoose.connect("mongodb://localhost/Escuela");
    console.log("Base de datos conectada");
  } catch (error) {
    // Si ocurre un error durante la conexión, lo registra en la consola.
    console.error("Error conectando a MongoDB:", error.message);
    // Termina el proceso de la aplicación si falla con un código de error (1).
    process.exit(1);
  }
};
