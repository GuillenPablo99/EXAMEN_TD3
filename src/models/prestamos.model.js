import { pool } from '../db.js';

export class PrestamoModel {
    static async getAll() {
        const result = await pool.query(`
            SELECT p.*, u.nombre, u.apellido_paterno, l.titulo, l.isbn
            FROM prestamos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN libros l ON p.id_libro = l.id_libro
            ORDER BY p.id_prestamo DESC
        `);
        return result.rows;
    }

    static async getById(id) {
        const result = await pool.query(`
            SELECT p.*, u.nombre, u.apellido_paterno, l.titulo, l.isbn
            FROM prestamos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN libros l ON p.id_libro = l.id_libro
            WHERE p.id_prestamo = $1
        `, [id]);
        return result.rows[0];
    }

    static async create({ id_usuario, id_libro }) {
        const result = await pool.query(
            `INSERT INTO prestamos (id_usuario, id_libro) 
             VALUES ($1, $2) RETURNING *`,
            [id_usuario, id_libro]
        );
        return result.rows[0];
    }

    static async registrarDevolucion(idPrestamo) {
        const result = await pool.query(
            `UPDATE prestamos 
             SET fecha_devolucion = CURRENT_DATE, estado = 'devuelto' 
             WHERE id_prestamo = $1 AND estado = 'activo' 
             RETURNING *`,
            [idPrestamo]
        );
        return result.rows[0];
    }

    static async getPrestamosActivos() {
        const result = await pool.query(`
            SELECT p.*, u.nombre, u.apellido_paterno, l.titulo, l.isbn
            FROM prestamos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN libros l ON p.id_libro = l.id_libro
            WHERE p.estado = 'activo'
            ORDER BY p.fecha_vencimiento ASC
        `);
        return result.rows;
    }

    static async getPrestamosVencidos() {
        const result = await pool.query(`
            SELECT p.*, u.nombre, u.apellido_paterno, l.titulo, l.isbn
            FROM prestamos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN libros l ON p.id_libro = l.id_libro
            WHERE p.estado = 'activo' AND p.fecha_vencimiento < CURRENT_DATE
            ORDER BY p.fecha_vencimiento ASC
        `);
        return result.rows;
    }

    static async getHistorialByUsuario(usuarioId) {
        const result = await pool.query(`
            SELECT p.*, l.titulo, l.autor, l.isbn
            FROM prestamos p
            JOIN libros l ON p.id_libro = l.id_libro
            WHERE p.id_usuario = $1
            ORDER BY p.fecha_prestamo DESC
        `, [usuarioId]);
        return result.rows;
    }

    static async actualizarPrestamosVencidos() {
        await pool.query(
            `UPDATE prestamos 
             SET estado = 'vencido' 
             WHERE estado = 'activo' AND fecha_vencimiento < CURRENT_DATE`
        );
    }
}