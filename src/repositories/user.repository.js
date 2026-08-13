import pool from '../config/db.js';

export async function getUsers() {
    const [rows] = await pool.query(`
        SELECT  id,
                username
        FROM users
        WHERE is_active = 1
        ORDER BY id DESC    
    `);

    return rows;
}