import app from "./app.js";
import { connectDB } from "./db.js";
import { createDefaultUser } from "./libs/createDefaultUser.js"; // 👈 Importa la función

async function main() {
  await connectDB(); // Conectamos a Mongo
  await createDefaultUser(); // 👈 Creamos el admin si no existe

  app.listen(5000, () => {
    console.log("🚀 Server on port", 5000);
  });
}

main();
