import { LibroModel } from '../models/libros.model.js';

export class LibroController {
    static async getAll(req, res) {
        try {
            const libros = await LibroModel.getAll();
            res.json(libros);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener libros' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const libro = await LibroModel.getById(id);
            
            if (!libro) {
                return res.status(404).json({ error: 'Libro no encontrado' });
            }
            
            res.json(libro);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener libro' });
        }
    }

    static async create(req, res) {
        try {
            const { titulo, autor, isbn, anio, categoria, copias_disponibles = 1, copias_totales = 1 } = req.body;
            
            // Verificar si el ISBN ya existe
            const libroExistente = await LibroModel.getByIsbn(isbn);
            if (libroExistente) {
                return res.status(400).json({ error: 'El ISBN ya está registrado' });
            }
            
            const nuevoLibro = await LibroModel.create({
                titulo,
                autor,
                isbn,
                anio,
                categoria,
                copias_disponibles,
                copias_totales
            });
            
            res.status(201).json(nuevoLibro);
        } catch (error) {
            if (error.code === '23505') {
                res.status(400).json({ error: 'El ISBN ya está registrado' });
            } else {
                res.status(500).json({ error: 'Error al crear libro' });
            }
        }
    }
}