import Task from '../models/tasks.models.js'

export const getTasks = async (req, res) => {
    const tasks = await Task.find({
        user: req.user.id
    }).populate('user')
    res.json(tasks)
};
export const createTasks = async (req, res) => {
    const { title, description, date } = req.body;
    const newTask = new Task({
        title,
        description,
        date,
        user: req.user.id
    });
    const saveTask = await newTask.save()
    res.json(saveTask);
};
export const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('user');
        if (!task) return res.status(404).json({ message: 'tarea no encontrada' })
        res.json(task)
    } catch (error) {
        return res.status(404).json({ message: 'tarea no encontrada' })
    }
};
export const deleteTasks = async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ message: 'tarea no encontrada' })
    return res.sendStatus(204);
};

export const updateTasks = async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    if (!task) return res.status(404).json({ message: 'tarea no encontrada' })
    res.json(task)
};
