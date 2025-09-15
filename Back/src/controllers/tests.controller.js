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
      .populate("company", "name headquarters")
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

    const newTest = new Tests({ ...rest, company });
    const result = await (
      await newTest.save()
    ).populate("company", "name headquarters");

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
      .populate("company", "name headquarters")
      .populate("user", "names docnumber email");

    if (!test) return res.status(404).json({ message: "Test not found" });

    // 🔒 Validar acceso según rol
    if (
      role !== "admin" &&
      !(
        (role === "consultorEmpresa" &&
          test.company._id.toString() === companyRef.toString()) || // 👈 aquí el fix
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

    // Validar id del test
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    let { company, ...rest } = req.body;

    // Validar company
    if (company) {
      if (typeof company === "string") {
        // Si es string, puede ser nombre o id
        if (!company.match(/^[0-9a-fA-F]{24}$/)) {
          // No es un ObjectId, buscar por nombre
          const companyDoc = await Company.findOne({ name: company });
          if (!companyDoc)
            return res.status(400).json({ message: "Empresa no encontrada" });
          company = companyDoc._id;
        }
      } else if (typeof company === "object" && company._id) {
        // Si viene como objeto con _id
        company = company._id;
      } else {
        return res
          .status(400)
          .json({ message: "Formato de company no válido" });
      }
    }

    // Preparar datos de actualización
    const updateData = { ...rest };
    if (company) updateData.company = company;

    // Actualizar test
    const updatedTest = await Tests.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("company", "name headquarters")
      .populate("user", "names docnumber email");

    if (!updatedTest)
      return res.status(404).json({ message: "Test no encontrado" });

    res.status(200).json(updatedTest);
  } catch (error) {
    console.error("Error updating test:", error);
    res.status(500).json({
      message: "Error interno al actualizar test",
      error: error.message,
    });
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
