import pool from '../config/db.js';

export async function getAll() {
    const [rows] = await pool.query(`
        SELECT * FROM dictionaries
        WHERE is_active = 1
        ORDER BY id ASC    
    `);

    return rows;
}