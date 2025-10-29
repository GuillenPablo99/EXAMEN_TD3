import { Router } from 'express';
import { PrestamoController } from '../controllers/prestamos.controller.js';
import { validarPrestamo } from '../controllers/validaciones.js';

const router = Router();

router.get('/', PrestamoController.getAll);
router.get('/activos', PrestamoController.getPrestamosActivos);
router.get('/vencidos', PrestamoController.getPrestamosVencidos);
router.get('/historial/:usuarioId', PrestamoController.getHistorialByUsuario);
router.post('/', validarPrestamo, PrestamoController.create);
router.patch('/devolucion/:id', PrestamoController.registrarDevolucion);

export default router;