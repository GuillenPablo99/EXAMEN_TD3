import { pool } from '../db.js';

export class LibroModel {
    static async getAll() {
        try {
            console.log('📊 Ejecutando consulta SELECT * FROM libros...');
            const result = await pool.query('SELECT * FROM libros ORDER BY id_libro DESC');
            console.log(`📚 Resultado: ${result.rows.length} libros encontrados`);
            return result.rows;
        } catch (error) {
            console.error('❌ ERROR en modelo LibroModel.getAll():', error.message);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const result = await pool.query('SELECT * FROM libros WHERE id_libro = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Error en getById:', error);
            throw error;
        }
    }

    static async getByIsbn(isbn) {
        try {
            const result = await pool.query('SELECT * FROM libros WHERE isbn = $1', [isbn]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Error en getByIsbn:', error);
            throw error;
        }
    }

    static async create({ titulo, autor, isbn, anio, categoria, copias_disponibles, copias_totales }) {
        try {
            const result = await pool.query(
                `INSERT INTO libros (titulo, autor, isbn, anio, categoria, copias_disponibles, copias_totales) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [titulo, autor, isbn, anio, categoria, copias_disponibles, copias_totales]
            );
            return result.rows[0];
        } catch (error) {
            console.error('❌ Error en create:', error);
            throw error;
        }
    }

    static async updateCopiasDisponibles(libroId, nuevaCantidad) {
        await pool.query(
            'UPDATE libros SET copias_disponibles = $1 WHERE id_libro = $2',
            [nuevaCantidad, libroId]
        );
    }

    static async decrementarCopia(libroId) {
        await pool.query(
            'UPDATE libros SET copias_disponibles = GREATEST(copias_disponibles - 1, 0) WHERE id_libro = $1',
            [libroId]
        );
    }

    static async incrementarCopia(libroId) {
        await pool.query(
            'UPDATE libros SET copias_disponibles = copias_disponibles + 1 WHERE id_libro = $1',
            [libroId]
        );
    }
}