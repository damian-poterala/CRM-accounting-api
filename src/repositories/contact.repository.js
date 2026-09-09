import pool from '../config/db.js';

export async function findById(id) {
    const [rows] = await pool.query(`
        SELECT id
        FROM client_contacts
        WHERE id = ?
        LIMIT 1
    `, [ id ]);

    return rows[0] || null;
}

export async function getContacts(clientId) {
    const [rows] = await pool.query(`
        SELECT 
            cc.id,
            cc.client_id,
            cc.first_name,
            cc.last_name,
            cc.position_id,
            (SELECT d.display_name FROM dictionaries AS d WHERE d.id = cc.position_id LIMIT 1) AS position,
            cc.email,
            cc.phone,
            cc.notes,
            DATE_FORMAT(cc.created_at, '%Y-%m-%d') AS created_at,
            DATE_FORMAT(cc.updated_at, '%Y-%m-%d') AS updated_at,
            cc.is_active
        FROM client_contacts AS cc
        WHERE client_id = ?
            AND is_active = 1       
    `, [ clientId ]);

    return rows;
}

export async function create(clientId, data) {
    const [result] = await pool.query(`
        INSERT INTO client_contacts (
            client_id,
            first_name,
            last_name,
            position_id,
            email,
            phone,
            notes,
            is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [ clientId, data.firstName, data.lastName, data.positionId, data.email, data.phone, data.notes, 1 ]);

    return result;
}

export async function update(contactId, data) {
    const [result] = await pool.query(`
        UPDATE client_contacts 
        SET first_name = ?,
            last_name = ?,
            position_id = ?,
            email = ?,
            phone = ?
        WHERE id = ?
        LIMIT 1
    `, [ data.firstName, data.lastName, data.positionId, data.email, data.phone, contactId ]);
    
    return result
}

export async function remove(id) {
    const [result] = await pool.query(`
        UPDATE client_contacts
        SET is_active = 0
        WHERE id = ?   
    `, [ id ]);

    return result;
}