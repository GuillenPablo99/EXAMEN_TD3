import { pool } from '../db.js';

export class UsuarioModel {
    static async getAll() {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY id_usuario DESC');
        return result.rows;
    }

    static async getById(id) {
        const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
        return result.rows[0];
    }

    static async create({ nombre, apellido_paterno, apellido_materno, correo, telefono }) {
        const result = await pool.query(
            `INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, correo, telefono) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombre, apellido_paterno, apellido_materno, correo, telefono]
        );
        return result.rows[0];
    }

    static async getPrestamosActivosCount(usuarioId) {
        const result = await pool.query(
            'SELECT COUNT(*) FROM prestamos WHERE id_usuario = $1 AND estado = $2',
            [usuarioId, 'activo']
        );
        return parseInt(result.rows[0].count);
    }

    static async incrementarPrestamosActivos(usuarioId) {
        await pool.query(
            'UPDATE usuarios SET prestamos_activos = prestamos_activos + 1 WHERE id_usuario = $1',
            [usuarioId]
        );
    }

    static async decrementarPrestamosActivos(usuarioId) {
        await pool.query(
            'UPDATE usuarios SET prestamos_activos = GREATEST(prestamos_activos - 1, 0) WHERE id_usuario = $1',
            [usuarioId]
        );
    }
}