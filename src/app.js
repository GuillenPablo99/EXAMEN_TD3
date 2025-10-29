import express from 'express';
import cors from 'cors';
import { testConnection } from './db.js';

// Importar rutas
import usuariosRoutes from './routes/usuarios.routes.js';
import librosRoutes from './routes/libros.routes.js';
import prestamosRoutes from './routes/prestamos.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/libros', librosRoutes);
app.use('/api/prestamos', prestamosRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Biblioteca Municipal de Tuxtla Gutiérrez',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/usuarios',
            libros: '/api/libros', 
            prestamos: '/api/prestamos'
        }
    });
});

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Biblioteca API'
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(` Servidor ejecutándose en puerto ${PORT}`);
    await testConnection();
});

export default app;