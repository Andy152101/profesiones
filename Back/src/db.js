import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost/Escuela')  // Aquí el cambio
    console.log("📡 Base de datos conectada")
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message)
    process.exit(1) // Cierra el proceso si falla
  }
};
