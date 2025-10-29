import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarios.controller.js';
import { validarUsuario } from '../controllers/validaciones.js'; 

const router = Router();

router.get('/', UsuarioController.getAll);
router.get('/:id', UsuarioController.getById);
router.post('/', validarUsuario, UsuarioController.create);

export default router;