/**
 * @file index.js
 * @description Punto de entrada principal para la aplicación backend. Conecta a la base de datos, crea un usuario administrador por defecto (si no existe) e inicia el servidor.
 */
import app from "./app.js";
import { connectDB } from "./db.js";
import { createDefaultUser } from "./libs/createDefaultUser.js"; // Importa la función

/**
 * Función principal asíncrona para inicializar la aplicación.
 * @async
 * @function main
 */
async function main() {
  // Conecta a la base de datos MongoDB.
  await connectDB();
  // Crea un usuario administrador por defecto si no existe en la base de datos.
  await createDefaultUser();
  // Inicia el servidor Express en el puerto 5000.
  app.listen(5000, () => {
    console.log("Server on port", 5000);
  });
}
// Ejecuta la función principal para iniciar la aplicación.
main();
