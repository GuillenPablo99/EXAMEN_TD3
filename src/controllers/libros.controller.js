import { LibroModel } from '../models/libros.model.js';

export class LibroController {
    static async getAll(req, res) {
        try {
            console.log('🔍 Intentando obtener libros desde la base de datos...');
            const libros = await LibroModel.getAll();
            console.log('✅ Libros obtenidos:', libros);
            res.json(libros);
        } catch (error) {
            console.error('❌ ERROR DETALLADO en libros:');
            console.error('Mensaje:', error.message);
            console.error('Stack:', error.stack);
            
            res.status(500).json({ 
                error: 'Error al obtener libros',
                detalle: error.message,
                stack: error.stack
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            console.log(`🔍 Buscando libro con ID: ${id}`);
            const libro = await LibroModel.getById(id);
            
            if (!libro) {
                return res.status(404).json({ error: 'Libro no encontrado' });
            }
            
            res.json(libro);
        } catch (error) {
            console.error('❌ Error al obtener libro por ID:', error);
            res.status(500).json({ 
                error: 'Error al obtener libro',
                detalle: error.message 
            });
        }
    }

    static async create(req, res) {
        try {
            const { titulo, autor, isbn, anio, categoria, copias_disponibles = 1, copias_totales = 1 } = req.body;
            console.log('📝 Creando nuevo libro:', { titulo, autor, isbn });
            
            const nuevoLibro = await LibroModel.create({
                titulo,
                autor,
                isbn,
                anio,
                categoria,
                copias_disponibles,
                copias_totales
            });
            
            console.log('✅ Libro creado:', nuevoLibro);
            res.status(201).json(nuevoLibro);
        } catch (error) {
            console.error('❌ Error al crear libro:', error);
            if (error.code === '23505') {
                res.status(400).json({ error: 'El ISBN ya está registrado' });
            } else {
                res.status(500).json({ 
                    error: 'Error al crear libro',
                    detalle: error.message 
                });
            }
        }
    }
}