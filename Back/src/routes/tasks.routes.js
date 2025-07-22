import { Router } from 'express'
import { authRequierd } from '../middlewares/validateToken.js'
import { getTask, getTasks, createTasks, deleteTasks, updateTasks } from '../controllers/tasks.controller.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { createtaskSchema } from '../schemas/task.schema.js'
const router = Router()

router.get('/tasks', authRequierd, getTasks)
router.get('/tasks/:id', authRequierd, getTask)
router.post('/tasks', authRequierd, validateSchema(createtaskSchema), createTasks)
router.delete('/tasks/:id', authRequierd, deleteTasks)
router.put('/tasks/:id', authRequierd, updateTasks)

export default router