// Poner este archivo en la carpeta controllers
export const validarLibro = (req, res, next) => {
    const { titulo, autor, isbn, anio, categoria } = req.body;
    
    if (!titulo || !autor || !isbn || !anio || !categoria) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    next();
};

export const validarUsuario = (req, res, next) => {
    const { nombre, apellido_paterno, apellido_materno, correo, telefono } = req.body;
    
    if (!nombre || !apellido_paterno || !apellido_materno || !correo || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    next();
};

export const validarPrestamo = (req, res, next) => {
    const { id_usuario, id_libro } = req.body;
    
    if (!id_usuario || !id_libro) {
        return res.status(400).json({ error: 'ID de usuario y ID de libro son requeridos' });
    }
    next();
};