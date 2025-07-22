import { Router } from "express";

import {createTests, getTests, getTest, deleteTest,updateTest} from '../controllers/tests.controller.js'

const router = Router()

router.get('/tests', getTests);
router.get('/tests/:id', getTest);
router.post('/tests', createTests);
router.delete('/tests/:id', deleteTest);
router.put('/tests/:id', updateTest);

export default router