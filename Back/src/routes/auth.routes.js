import { Router } from 'express'
import { login, register, logout, profile, verifyToken, getAllRegisters, viewRegister,deleteRegisters,updateRegisters} from '../controllers/auth.controller.js'
import { authRequierd } from '../middlewares/validateToken.js'
import  {validateSchema} from '../middlewares/validator.middleware.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js' 


const router = Router();

router.post("/register", validateSchema(registerSchema),authRequierd,register);
router.get('/registers', getAllRegisters);
router.get('/register/:id', viewRegister);
router.delete('/registers/:id', deleteRegisters);
router.put('/registers/:id', updateRegisters);
router.post("/login",validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/verify", verifyToken)
router.get("/profile", authRequierd, profile);

export default router;
