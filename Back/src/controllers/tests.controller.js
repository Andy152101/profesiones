// Importa el modelo de Tests para interactuar con la base de datos
import Tests from "../models/tests.models.js";
import Company from "../models/company.model.js";
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
    const { role, companyRef, peopleRef } = req.user; // del token
    let filter = {};

    if (role === "admin") {
      filter = req.query || {};
    } else if (role === "consultorEmpresa") {
      filter = { company: companyRef, ...(req.query || {}) };
    } else if (role === "empleado") {
      filter = { user: peopleRef, ...(req.query || {}) };
    }

    const result = await Tests.find(filter)
      .populate("company", "name")
      .populate("user", "names docnumber email");

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
    let { company, ...rest } = req.body;

    // Si company es un string que no parece un ObjectId, busca por nombre
    if (company && !company.match(/^[0-9a-fA-F]{24}$/)) {
      const companyDoc = await Company.findOne({ name: company });
      if (!companyDoc) {
        return res.status(400).json({ message: "Empresa no encontrada" });
      }
      company = companyDoc._id;
    }

    const item = new Tests({ ...rest, company });
    const result = await item.save();

    return res.status(201).json(result);
  } catch (err) {
    console.error("Tests creation failed:", err);
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
    const { role, companyRef, peopleRef } = req.user;

    if (!id) return res.status(400).json({ message: "ID is required" });

    const test = await Tests.findById(id)
      .populate("company", "name")
      .populate("user", "names docnumber email");

    if (!test) return res.status(404).json({ message: "Test not found" });

    // 🔒 Validar acceso según rol
    if (
      role !== "admin" &&
      !(
        (role === "consultorEmpresa" &&
          test.company.toString() === companyRef.toString()) ||
        (role === "empleado" &&
          test.user._id.toString() === peopleRef.toString())
      )
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json(test);
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
    let { company, ...rest } = req.body;

    // si viene nombre en lugar de ObjectId, conviértelo
    if (company && !company.match(/^[0-9a-fA-F]{24}$/)) {
      const companyDoc = await Company.findOne({ name: company });
      if (!companyDoc) {
        return res.status(400).json({ message: "Empresa no encontrada" });
      }
      company = companyDoc._id;
    }

    const updatedTest = await Tests.findByIdAndUpdate(
      id,
      { ...rest, company },
      { new: true }
    ).populate("company", "name");

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
