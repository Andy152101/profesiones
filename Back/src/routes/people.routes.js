import { Router } from 'express';
import { createPeople, getPeoples, getPeople, deletePeople, updatePeople, getPeopleByDocNumber } from '../controllers/people.controller.js';
import { authRequierd } from '../middlewares/validateToken.js';


const router = Router();

router.get('/people', getPeoples); // Permitir a admin y editor
router.get('/people/:id', getPeople); // Permitir a admin y editor
router.post('/people', createPeople); // Solo admin puede crear
router.delete('/people/:id', deletePeople); // Solo admin puede eliminar
router.put('/people/:id',updatePeople); // Permitir a admin y editor
router.get('/people/search/:docNumber', getPeopleByDocNumber); // Permitir a admin y editor

export default router;
