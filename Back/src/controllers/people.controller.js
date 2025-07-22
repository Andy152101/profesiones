import People from '../models/people.models.js'

const errorHandler = (error) => {
  let message = "";
  let status = 500;

  if (error.name === "CastError") {
    message = `Invalid ${error.path}: ${error.value}`;
    status = 400;
  } else if (error.name === "ValidationError") {
    message = Object.values(error.errors).map(err => err.message).join(", ");
    status = 400;
  } else {
    message = error.message || "Internal Server Error";
  }

  return { status, message };
};




export const getPeoples = async (req, res) => {
  try {
    let query = req.query || {};
    const result = await People.find(query);
    return res.status(200).json(result);
  } catch (err) {
    console.error("People getAll failed: " + err);
    const { status, message } = errorHandler(err)
    res.status(status).json({ message, entity: 'People' })
  }
};

export const createPeople = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Registra el cuerpo de la solicitud
    const { docnumber, email } = req.body;

    // Verifica si el número de cédula ya existe
    const existingDocNumber = await People.findOne({ docnumber });
    if (existingDocNumber) {
      return res.status(400).json({ error: `Número de cédula '${docnumber}' ya existe` });
    }

    // Verifica si el correo electrónico ya existe
    const existingEmail = await People.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: `Correo electrónico '${email}' ya existe` });
    }

    // Si no hay duplicados, crea la nueva persona
    const newPerson = new People(req.body);
    const savedPerson = await newPerson.save();
    return res.status(201).json(savedPerson); // Código 201 para creación exitosa
  } catch (error) {
    console.error("Error creando persona:", error);
    return res.status(500).json({ error: 'Error desconocido' });
  }
};

export const getPeople = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await People.findById(id);

    return res.status(200).json(result);
  } catch (err) {
    console.error("People getById failed: " + err);
    const { status, message } = errorHandler(err)
    res.status(status).json({ message, entity: 'People' })
  }
};

export const deletePeople = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await People.deleteOne({ _id: id });
    return res.status(200).json(result);
  } catch (err) {
    console.error("People delete failed: " + err);
    const { status, message } = errorHandler(err)
    res.status(status).json({ message, entity: 'People' })
  }
};

export const updatePeople = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await People.findOneAndUpdate({ _id: id }, req.body, { new: true });

    return res.status(200).json(result);
  } catch (err) {
    console.error("People update failed: " + err);
    const { status, message } = errorHandler(err)
    res.status(status).json({ message, entity: 'People' })
  }
};

export const getPeopleByDocNumber = async (req, res) => {
  try {
    const { docNumber } = req.params;
    const result = await People.findOne({ docnumber: docNumber });
    if (!result) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error("People getByCedula failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: 'People' });
  }
};

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
    return res.status(500).json({ message: 'Error al validar el correo electrónico.' });
  }
};