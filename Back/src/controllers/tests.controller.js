// Importa el modelo de Tests para interactuar con la base de datos
import Tests from "../models/tests.models.js";

// Función para manejar errores y devolver un objeto de respuesta con el status y mensaje
const errorHandler = (err) => {
  console.error(err); // Para ver el error en la consola
  return {
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  };
};

// Función para obtener todos los tests según la consulta proporcionada
// Si no se proporciona una consulta, se utiliza un objeto vacío para buscar todos los tests
// Se devuelve un objeto de respuesta con el status y mensaje de éxito
// Si ocurre un error, se devuelve un objeto de respuesta con el status y mensaje de error
// Se utiliza un catch para capturar cualquier error que ocurra en la función y se devuelve un objeto de respuesta con el status y mensaje de error
export const getTests = async (req, res) => {
  try {
    let query = req.query || {};
    const result = await Tests.find(query);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Tests getAll failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: "Tests" });
  }
};

// Función para crear un nuevo test en la base de datos
// Se crea una instancia del modelo de Tests con los datos proporcionados en el cuerpo de la solicitud
// Se guarda el nuevo test en la base de datos y se devuelve un objeto de respuesta con el status y mensaje de éxito
// Si ocurre un error, se devuelve un objeto de respuesta con el status y mensaje de error
// Se utiliza un catch para capturar cualquier error que ocurra en la función y se devuelve un objeto de respuesta con el status y mensaje de error
export const createTests = async (req, res) => {
  try {
    const item = new Tests(req.body);
    const result = await item.save();
    return res.status(200).json(result);
  } catch (err) {
    console.error("Tests creation failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: "Tests" });
  }
};

// Función para obtener un test por su ID
// Se verifica si se proporciona un ID en los parámetros de la solicitud
// Si no se proporciona un ID, se devuelve un objeto de respuesta con el status y mensaje de error
// Si se proporciona un ID, se busca el test en la base de datos por su ID
// Si no se encuentra el test, se devuelve un objeto de respuesta con el status y mensaje de error
// Si se encuentra el test, se devuelve un objeto de respuesta con el status y mensaje de éxito y el test encontrado
// Si ocurre un error, se devuelve un objeto de respuesta con el status y mensaje de error
// Se utiliza un catch para capturar cualquier error que ocurra en la función y se devuelve un objeto de respuesta con el status y mensaje de error
export const getTest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID is required" });
    const result = await Tests.findById(id);
    if (!result) return res.status(404).json({ message: "Test not found" });
    return res.status(200).json(result);
  } catch (err) {
    console.error("Tests getById failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: "Tests" });
  }
};

// Función para actualizar un test por su ID
// Se verifica si se proporciona un ID en los parámetros de la solicitud
// Si no se proporciona un ID, se devuelve un objeto de respuesta con el status y mensaje de error
// Si se proporciona un ID, se busca el test en la base de datos por su ID
// Si no se encuentra el test, se devuelve un objeto de respuesta con el status y mensaje de error
// Si se encuentra el test, se actualiza el test con los datos proporcionados en el cuerpo de la solicitud
// Se devuelve un objeto de respuesta con el status y mensaje de éxito y el test actualizado
// Si ocurre un error, se devuelve un objeto de respuesta con el status y mensaje de error
// Se utiliza un catch para capturar cualquier error que ocurra en la función y se devuelve un objeto de respuesta con el status y mensaje de error
export const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTest = await Tests.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTest) {
      return res.status(404).send("Test not found");
    }
    res.status(200).json(updatedTest);
  } catch (error) {
    console.error("Error updating test:", error);
    res.status(500).send("Server error");
  }
};

// Función para eliminar un test por su ID
// Se verifica si se proporciona un ID en los parámetros de la solicitud
// Si no se proporciona un ID, se devuelve un objeto de respuesta con el status y mensaje de error
// Si se proporciona un ID, se busca el test en la base de datos por su ID
// Si no se encuentra el test, se devuelve un objeto de respuesta con el status y mensaje de error
// Si se encuentra el test, se elimina el test de la base de datos
// Se devuelve un objeto de respuesta con el status y mensaje de éxito y el test eliminado
// Si ocurre un error, se devuelve un objeto de respuesta con el status y mensaje de error
// Se utiliza un catch para capturar cualquier error que ocurra en la función y se devuelve un objeto de respuesta con el status y mensaje de error
export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Tests.deleteOne({ _id: id });
    return res.status(200).json(result);
  } catch (err) {
    console.error("Tests delete failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: "Tests" });
  }
};
