import { PrestamoModel } from '../models/prestamos.model.js';
import { UsuarioModel } from '../models/usuarios.model.js';
import { LibroModel } from '../models/libros.model.js';

export class PrestamoController {
    static async getAll(req, res) {
        try {
            const prestamos = await PrestamoModel.getAll();
            res.json(prestamos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener préstamos' });
        }
    }

    static async create(req, res) {
        try {
            const { id_usuario, id_libro } = req.body;

            // VALIDACIÓN 1: Verificar que el usuario existe
            const usuario = await UsuarioModel.getById(id_usuario);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // VALIDACIÓN 2: Verificar que el libro existe
            const libro = await LibroModel.getById(id_libro);
            if (!libro) {
                return res.status(404).json({ error: 'Libro no encontrado' });
            }

            // VALIDACIÓN 3: No permitir préstamos si no hay copias disponibles
            if (libro.copias_disponibles <= 0) {
                return res.status(400).json({ error: 'No hay copias disponibles de este libro' });
            }

            // VALIDACIÓN 4: Un usuario no puede tener más de 3 préstamos activos
            const prestamosActivos = await UsuarioModel.getPrestamosActivosCount(id_usuario);
            if (prestamosActivos >= 3) {
                return res.status(400).json({ 
                    error: 'El usuario ya tiene 3 préstamos activos. No puede solicitar más.' 
                });
            }

            // Crear el préstamo
            const nuevoPrestamo = await PrestamoModel.create({
                id_usuario,
                id_libro
            });

            // Actualizar contadores
            await UsuarioModel.incrementarPrestamosActivos(id_usuario);
            await LibroModel.decrementarCopia(id_libro);

            res.status(201).json(nuevoPrestamo);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear préstamo' });
        }
    }

    static async registrarDevolucion(req, res) {
        try {
            const { id } = req.params;

            const prestamo = await PrestamoModel.registrarDevolucion(id);
            
            if (!prestamo) {
                return res.status(404).json({ error: 'Préstamo no encontrado o ya devuelto' });
            }

            // Actualizar contadores
            await UsuarioModel.decrementarPrestamosActivos(prestamo.id_usuario);
            await LibroModel.incrementarCopia(prestamo.id_libro);

            res.json({ 
                message: 'Libro devuelto exitosamente', 
                prestamo 
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar devolución' });
        }
    }

    static async getPrestamosActivos(req, res) {
        try {
            const prestamosActivos = await PrestamoModel.getPrestamosActivos();
            res.json(prestamosActivos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener préstamos activos' });
        }
    }

    static async getPrestamosVencidos(req, res) {
        try {
            // Actualizar estado de préstamos vencidos primero
            await PrestamoModel.actualizarPrestamosVencidos();
            
            const prestamosVencidos = await PrestamoModel.getPrestamosVencidos();
            res.json(prestamosVencidos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener préstamos vencidos' });
        }
    }

    static async getHistorialByUsuario(req, res) {
        try {
            const { usuarioId } = req.params;
            const historial = await PrestamoModel.getHistorialByUsuario(usuarioId);
            res.json(historial);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener historial de préstamos' });
        }
    }
}