import { Router } from 'express';
import { LibroController } from '../controllers/libros.controller.js';
import { validarLibro } from '../controllers/validaciones.js'; 

const router = Router();

router.get('/', LibroController.getAll);
router.get('/:id', LibroController.getById);
router.post('/', validarLibro, LibroController.create);

export default router;