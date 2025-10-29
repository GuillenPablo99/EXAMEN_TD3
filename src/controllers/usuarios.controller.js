import { UsuarioModel } from '../models/usuarios.model.js';

export class UsuarioController {
    static async getAll(req, res) {
        try {
            const usuarios = await UsuarioModel.getAll();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await UsuarioModel.getById(id);
            
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuario' });
        }
    }

    static async create(req, res) {
        try {
            const { nombre, apellido_paterno, apellido_materno, correo, telefono } = req.body;
            
            const nuevoUsuario = await UsuarioModel.create({
                nombre,
                apellido_paterno,
                apellido_materno,
                correo,
                telefono
            });
            
            res.status(201).json(nuevoUsuario);
        } catch (error) {
            if (error.code === '23505') { // Violación de unique constraint
                res.status(400).json({ error: 'El correo electrónico ya está registrado' });
            } else {
                res.status(500).json({ error: 'Error al crear usuario' });
            }
        }
    }
}