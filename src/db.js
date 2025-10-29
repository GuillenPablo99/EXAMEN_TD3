import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,  // Cambié DB_NAME por DB_DATABASE
    port: process.env.DB_PORT || 5432,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Función para probar la conexión
export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión a PostgreSQL exitosa');
        client.release();
    } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error);
    }
};