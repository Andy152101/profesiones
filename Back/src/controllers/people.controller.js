// Importa el modelo de People para interactuar con la base de datos de personas
import People from "../models/people.models.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Función para manejar errores y devolver un objeto estándar
const errorHandler = (error) => {
  let message = "";
  let status = 500;

  if (error.name === "CastError") {
    message = `Invalid ${error.path}: ${error.value}`;
    status = 400;
  } else if (error.name === "ValidationError") {
    message = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
    status = 400;
  } else {
    message = error.message || "Internal Server Error";
  }

  return { status, message };
};

//obtiene todas las personas segun los parametos de consulta
// obtiene todas las personas según los parámetros de consulta
export const getPeoples = async (req, res) => {
  try {
    const { role, companyRef, id } = req.user; // 👈 vienen del token
    let filter = {};

    if (role === "admin") {
      // Admin ve todo
      filter = req.query || {};
    } else if (role === "consultorEmpresa") {
      // Consultor ve todas las personas de su empresa
      filter = { company: companyRef, ...(req.query || {}) };
    } else if (role === "empleado") {
      filter = { _id: req.user.peopleRef };
    }

    const result = await People.find(filter)
      .populate("company", "name headquarters")
      .exec();

    return res.status(200).json(result);
  } catch (err) {
    console.error("People getAll failed: " + err);
    res.status(500).json({ message: err.message, entity: "People" });
  }
};

// Crea una nueva persona, validando que el número de cédula y el correo sean únicos
// y que el correo sea único.
export const createPeople = async (req, res) => {
  try {
    const { docnumber, email, company } = req.body;

    // 🔎 Validaciones
    const existingDocNumber = await People.findOne({ docnumber });
    if (existingDocNumber) {
      return res
        .status(400)
        .json({ error: `Número de cédula '${docnumber}' ya existe` });
    }

    const existingEmail = await People.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: `Correo electrónico '${email}' ya existe` });
    }

    //  Crear persona
    const newPerson = new People(req.body);
    const savedPerson = await newPerson.save(); //  primero guardamos
    await savedPerson.populate("company", "name headquarters"); // luego populamos

    // 2️⃣ Crear usuario asociado
    const hashedPassword = await bcrypt.hash(docnumber, 10); // contraseña inicial = cédula
    const normalizedName = savedPerson.names
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
    const newUser = new User({
      username: normalizedName, // o el mismo email si prefieres
      email,
      password: hashedPassword,
      role: "empleado", // 👈 puedes cambiarlo según el caso
      companyRef: company,
      peopleRef: savedPerson._id,
      defaultPasswordSet: true, // para forzar cambio de clave al inicio si quieres
    });

    await newUser.save();

    // 3️⃣ Responder con ambos
    return res.status(201).json({
      message: "Persona y usuario creados exitosamente",
      person: savedPerson,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creando persona:", error);
    return res.status(500).json({ error: "Error desconocido" });
  }
};

// Obtiene una persona específica por su ID
// Obtiene una persona específica por su ID
export const getPeople = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, peopleRef, companyRef } = req.user;

    let result;

    if (role === "admin") {
      // 🔹 Admin puede ver a cualquiera
      result = await People.findById(id).populate("company", "name");
    } else if (role === "consultorEmpresa") {
      // 🔹 Consultor solo puede ver personas de su empresa
      result = await People.findOne({ _id: id, company: companyRef }).populate(
        "company",
        "name"
      );
    } else if (role === "empleado") {
      // 🔹 Empleado solo puede ver su propio registro
      if (peopleRef.toString() !== id) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para ver este registro" });
      }
      result = await People.findById(peopleRef).populate("company", "name");
    }

    if (!result) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("People getById failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: "People" });
  }
};

// Elimina una persona por su ID
export const deletePeople = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await People.deleteOne({ _id: id });
    return res.status(200).json(result);
  } catch (err) {
    console.error("People delete failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: "People" });
  }
};

// Actualiza una persona por su ID
// req.body debe contener los campos que deseas actualizar
// El campo _id se actualiza automáticamente para reflejar el nuevo ID de la persona
export const updatePeople = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await People.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("People update failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: "People" });
  }
};

// Obtiene una persona por su número de documento
// req.params debe contener el número de documento de la persona
// El campo _id se actualiza automáticamente para reflejar el nuevo ID de la persona
export const getPeopleByDocNumber = async (req, res) => {
  try {
    const { docNumber } = req.params;
    const result = await People.findOne({ docnumber: docNumber })
      .populate("company", "name headquarters")
      .exec();

    if (!result) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error("People getByCedula failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: "People" });
  }
};

// Obtiene una persona por su correo electrónico
// req.params debe contener el correo
// El campo _id se actualiza automáticamente para reflejar el nuevo ID de la persona
export const getPeopleByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Obtén el correo electrónico de los parámetros de la ruta
    const result = await People.findOne({ email: email });
    if (!result) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error al obtener persona por correo electrónico: " + err);
    return res
      .status(500)
      .json({ message: "Error al validar el correo electrónico." });
  }
};
