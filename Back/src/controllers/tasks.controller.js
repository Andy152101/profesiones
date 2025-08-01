// Importa el modelo de Task para interactuar con la base de datos de tareas
import Task from "../models/tasks.models.js";

// Busca y retorna todas las tareas del usuario autenticado.
// 1. Busca tareas cuyo campo 'user' coincida con el usuario autenticado.
// 2. Usa populate para incluir los datos del usuario.
// 3. Devuelve el array de tareas encontradas.
export const getTasks = async (req, res) => {
  // 1. Busca tareas del usuario actual
  const tasks = await Task.find({
    user: req.user.id,
  }).populate("user");
  // 2. Devuelve el array de tareas encontradas
  res.json(tasks);
};

// Crea una nueva tarea asociada al usuario autenticado.
// 1. Extrae los datos de la tarea del cuerpo de la petición.
// 2. Crea una nueva instancia de Task con esos datos y el usuario.
// 3. Guarda la tarea en la base de datos.
// 4. Devuelve la tarea guardada.
export const createTasks = async (req, res) => {
  // 1. Extrae los datos de la tarea del cuerpo de la petición
  const { title, description, date } = req.body;
  // 2. Crea una nueva instancia de Task con esos datos y el usuario
  const newTask = new Task({
    title,
    description,
    date,
    user: req.user.id,
  });
  // 3. Guarda la tarea en la base de datos
  const saveTask = await newTask.save();
  // 4. Devuelve la tarea guardada
  res.json(saveTask);
};
// Busca una tarea por su ID y la retorna.
// 1. Busca una tarea por su ID.
// 2. Usa populate para incluir los datos del usuario.
// 3. Devuelve la tarea encontrada.
export const getTask = async (req, res) => {
  try {
    // 1. Busca una tarea por su ID
    const task = await Task.findById(req.params.id).populate("user");
    // 2. Usa populate para incluir los datos del usuario
    if (!task) return res.status(404).json({ message: "tarea no encontrada" });
    // 3. Devuelve la tarea encontrada
    res.json(task);
  } catch (error) {
    return res.status(404).json({ message: "tarea no encontrada" });
  }
};
// Elimina una tarea por su ID.
// 1. Busca una tarea por su ID.
// 2. Si no se encuentra la tarea, devuelve un error.
// 3. Si se encuentra la tarea, la elimina y devuelve un código de estado 204.
export const deleteTasks = async (req, res) => {
  // 1. Busca una tarea por su ID
  const task = await Task.findByIdAndDelete(req.params.id);
  // 2. Si no se encuentra la tarea, devuelve un error
  if (!task) return res.status(404).json({ message: "tarea no encontrada" });
  // 3. Si se encuentra la tarea, la elimina y devuelve un código de estado 204
  return res.sendStatus(204);
};

// Actualiza una tarea por su ID.
// 1. Busca una tarea por su ID.
// 2. Si no se encuentra la tarea, devuelve un error.
// 3. Si se encuentra la tarea, actualiza los datos y devuelve la tarea actualizada.
export const updateTasks = async (req, res) => {
  // 1. Busca una tarea por su ID
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // 2. Si no se encuentra la tarea, devuelve un error
  if (!task) return res.status(404).json({ message: "tarea no encontrada" });
  //3. Si se encuentra la tarea, actualiza los datos y devuelve la tarea actualizada
  res.json(task);
};
