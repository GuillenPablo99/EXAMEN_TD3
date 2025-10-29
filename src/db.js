import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 5432,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Función mejorada para diagnosticar
export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión a PostgreSQL exitosa');
        
        // Obtener información de la base de datos conectada
        const dbInfo = await client.query('SELECT current_database(), current_user');
        console.log('📊 Base de datos conectada:', dbInfo.rows[0].current_database);
        console.log('👤 Usuario:', dbInfo.rows[0].current_user);
        
        // Verificar si la tabla libros existe
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'libros'
            ) as tabla_existe;
        `);
        
        console.log('📚 ¿Tabla libros existe?:', tableCheck.rows[0].tabla_existe);
        
        client.release();
    } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error.message);
        console.error('🔧 Configuración actual:', {
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            port: process.env.DB_PORT
        });
    }
};