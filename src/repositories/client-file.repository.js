import pool from '../config/db.js';

export async function getFiles(clientId) {
    const [rows] = await pool.query(`
        SELECT 
            cf.id,
            cf.client_id,
            cf.original_name,
            cf.mime_type,
            cf.extension,
            cf.file_size,
            cf.user_id,
            (SELECT u.username FROM users AS u WHERE u.id = cf.user_id LIMIT 1) AS uploaded_by,
            DATE_FORMAT(cf.created_at, '%Y-%m-%d %H:%i') AS created_at
        FROM client_files AS cf 
        WHERE cf.client_id = ?
        ORDER BY cf.created_at DESC
    `, [ clientId ]);

    return rows;
}

export async function findById(id, clientId) {
    const [rows] = await pool.query(`
        SELECT 
            cf.id,
            cf.client_id,
            cf.original_name,
            cf.mime_type,
            cf.extension,
            cf.file_size,
            cf.file_data,
            cf.user_id,
            cf.user_id,
            cf.created_at
        FROM client_files AS cf
        WHERE cf.id = ?
            AND cf.client_id = ?
    `, [ id, clientId ]);

    return rows[0] || null;
}

export async function create(clientId, data, userId) {
    const [result] = await pool.query(`
        INSERT INTO client_files (
            client_id,
            original_name,
            mime_type,
            extension,
            file_size,
            file_data,
            user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [ clientId, data.originalName, data.mimeType, data.extension, data.fileSize, data.fileData, userId ]);

    return result;
}

export async function remove(id, clientId) {
    const [result] = await pool.query(`
        DELETE FROM client_files
        WHERE id = ?
            AND client_id = ?
        LIMIT 1
    `, [ id, clientId ]);

    return result;
}